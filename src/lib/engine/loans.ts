/**
 * Federal student loan repayment engine (pure functions, no network). Every rule is read from
 * src/data/params-2026.json; the statute and the regulation each function applies are named above it.
 * Amounts are monthly dollars unless the name says otherwise. Cents stay in the calculations.
 */
import P from '../../data/params-2026.json';

export type Area = 'us' | 'ak' | 'hi';
export type Filing = 'single' | 'mfj' | 'mfs';

/** HHS poverty guideline for a family size. Year 2026 for repayment, 2024 for the 2026-27 FAFSA. */
export function poverty(size: number, area: Area = 'us', year: '2026' | '2024' = '2026'): number {
  const [first, extra] = (P.fpl as Record<string, Record<Area, number[]>>)[year][area];
  const n = Math.max(1, Math.round(size));
  return first + extra * (n - 1);
}

/** Level payment that repays `principal` at `annualRate` percent over `months`. */
export function amortized(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** 10-year standard plan, 34 CFR 685.208(b)(1): fixed payments, $50 minimum. */
export function standard10(principal: number, annualRate: number): number {
  if (principal <= 0) return 0;
  return Math.max(P.standard.minPayment, amortized(principal, annualRate, P.standard.years10 * 12));
}

/** Tiered Standard term, HEA 455(d)(7)(A)(i), 34 CFR 685.208(c)(1): 10, 15, 20 or 25 years by total principal. */
export function tierYears(totalPrincipal: number): number {
  for (const [limit, years] of P.standard.tiers as Array<[number | null, number]>) if (limit === null || totalPrincipal < limit) return years;
  return 25;
}
export function tieredStandard(principal: number, annualRate: number) {
  const years = tierYears(principal);
  const payment = principal <= 0 ? 0 : Math.max(Math.min(P.standard.minPayment, principal), amortized(principal, annualRate, years * 12));
  return { years, months: years * 12, payment };
}

/** RAP base payment, HEA 455(q)(4)(B)(iv), 34 CFR 685.209(b)(2): one rate on the WHOLE AGI, by bracket. */
export function rapBase(agi: number): { base: number; pct: number } {
  const a = Math.max(0, agi);
  const br = P.rap.brackets as Array<[number, number]>;
  if (a <= br[0][0]) return { base: P.rap.floorBase, pct: 0 };
  for (let i = 1; i < br.length; i++) if (a <= br[i][0]) return { base: (a * br[i][1]) / 100, pct: br[i][1] };
  return { base: (a * P.rap.topPct) / 100, pct: P.rap.topPct };
}

export interface RapInput { agi: number; dependents: number; filing?: Filing; spouseAgi?: number; ownDebt?: number; spouseDebt?: number }
/**
 * RAP monthly payment, 34 CFR 685.209(f)(5), (e)(1), (g)(3): base / 12 minus $50 per dependent, $10 minimum.
 * Married filing jointly: combined AGI, and if the spouse also has eligible loans, the payment is
 * prorated by the borrower's share of the couple's debt (again $10 minimum).
 */
export function rapPayment(i: RapInput) {
  const joint = i.filing === 'mfj';
  const agi = Math.max(0, i.agi) + (joint ? Math.max(0, i.spouseAgi ?? 0) : 0);
  const { base, pct } = rapBase(agi);
  const deps = Math.max(0, Math.floor(i.dependents));
  const raw = base / 12 - P.rap.perDependent * deps;
  let payment = Math.max(P.rap.minPayment, raw);
  let share = 1;
  if (joint && (i.spouseDebt ?? 0) > 0 && (i.ownDebt ?? 0) > 0) {
    share = (i.ownDebt as number) / ((i.ownDebt as number) + (i.spouseDebt as number));
    payment = Math.max(P.rap.minPayment, payment * share);
  }
  return { agi, base, pct, raw, payment, share, minimumApplied: raw < P.rap.minPayment };
}

export interface IbrInput { agi: number; familySize: number; area?: Area; newBorrower: boolean; filing?: Filing; spouseAgi?: number; balance: number; rate: number; ownDebt?: number; spouseDebt?: number; stdCap?: number }
/**
 * IBR monthly payment, HEA 493C(a)(3), (b)(6); 34 CFR 685.209(b)(1), (f)(2)-(3), (g)(1):
 * 15% (10% for a new borrower) of AGI above 150% of the poverty guideline, divided by 12,
 * never more than the 10-year standard payment; under $5 = $0, $5 to $10 = $10.
 */
export function ibrPayment(i: IbrInput) {
  const joint = i.filing === 'mfj';
  const agi = Math.max(0, i.agi) + (joint ? Math.max(0, i.spouseAgi ?? 0) : 0);
  const line = (poverty(i.familySize, i.area ?? 'us', '2026') * P.ibr.povertyPct) / 100;
  const pct = i.newBorrower ? P.ibr.newPct : P.ibr.oldPct;
  const discretionary = Math.max(0, agi - line);
  let payment = (discretionary * pct) / 100 / 12;
  let share = 1;
  if (joint && (i.spouseDebt ?? 0) > 0 && (i.ownDebt ?? 0) > 0) { share = (i.ownDebt as number) / ((i.ownDebt as number) + (i.spouseDebt as number)); payment *= share; }
  const cap = i.stdCap ?? standard10(i.balance, i.rate);
  const capped = payment > cap;
  if (capped) payment = cap;
  if (payment < P.ibr.zeroBelow) payment = 0; else if (payment < P.ibr.tenBelow) payment = P.ibr.tenBelow;
  return { agi, line, pct, discretionary, payment, capped, cap, share };
}

/** What the SAVE (REPAYE) formula of 34 CFR 685.209(f)(1) would give: shown only for comparison, the plan is closed. */
export function saveFormula(agi: number, familySize: number, area: Area = 'us', undergradShare = 1) {
  const line = (poverty(familySize, area, '2026') * P.save.povertyPct) / 100;
  const over = Math.max(0, agi - line);
  const u = Math.min(1, Math.max(0, undergradShare));
  let payment = (over * (P.save.undergradPct * u + P.save.gradPct * (1 - u))) / 100 / 12;
  if (payment < 5) payment = 0; else if (payment < 10) payment = 10;
  return { line, payment };
}

export interface SimResult {
  plan: string;
  firstPayment: number;
  months: number;
  totalPaid: number;
  forgiven: number;
  interestWaived: number;
  matched: number;
  paidOff: boolean;
  /** Year-end balances (principal + unpaid interest), index 0 = start. */
  balances: number[];
  payments: number[];
}

interface SimOpts { balance: number; rate: number; agi: number; growth: number; years?: number }
const yearPayFactory = (agi: number, growth: number) => (y: number) => agi * Math.pow(1 + growth / 100, y);

/**
 * RAP month by month, 34 CFR 685.209(h)(4) and (o)(2): the payment goes to interest, then principal;
 * on-time payments waive the interest they do not cover; if principal falls by less than $50,
 * ED adds the difference up to the lesser of $50 or the payment. Forgiveness after 360 payments.
 * Assumes every payment is on time and income moves by `growth` % a year.
 */
export function simulateRap(o: SimOpts & { dependents: number; filing?: Filing; spouseAgi?: number }): SimResult {
  const income = yearPayFactory(o.agi, o.growth);
  let principal = o.balance; let paid = 0; let waived = 0; let matched = 0; let m = 0;
  const r = o.rate / 100 / 12; const balances = [principal]; const payments: number[] = [];
  const maxMonths = P.rap.payments;
  let pay = 0;
  while (principal > 0.005 && m < maxMonths) {
    if (m % 12 === 0) { pay = rapPayment({ agi: income(m / 12), dependents: o.dependents, filing: o.filing, spouseAgi: o.spouseAgi ? o.spouseAgi * Math.pow(1 + o.growth / 100, m / 12) : 0 }).payment; payments.push(pay); }
    const interest = principal * r;
    const due = principal + interest;
    const p = Math.min(pay, due);
    const toInterest = Math.min(p, interest);
    const toPrincipal = p - toInterest;
    waived += interest - toInterest;
    principal -= toPrincipal;
    if (toPrincipal < P.rap.matchMax && principal > 0) { const add = Math.min(principal, Math.max(0, Math.min(P.rap.matchMax, p) - toPrincipal)); principal -= add; matched += add; }
    paid += p; m++;
    if (m % 12 === 0) balances.push(Math.max(0, principal));
  }
  const paidOff = principal <= 0.005;
  if (!paidOff && m % 12 !== 0) balances.push(principal);
  return { plan: 'rap', firstPayment: payments[0] ?? 0, months: m, totalPaid: paid, forgiven: paidOff ? 0 : principal, interestWaived: waived, matched, paidOff, balances, payments };
}

/**
 * IBR month by month: unpaid interest accrues (no waiver; the 3-year subsidized-interest benefit is not modeled),
 * payment recomputed each year on the grown income, capped at the 10-year standard amount fixed at entry.
 * Forgiveness after 240 (new borrower) or 300 payments.
 */
export function simulateIbr(o: SimOpts & { familySize: number; area?: Area; newBorrower: boolean; filing?: Filing; spouseAgi?: number }): SimResult {
  const income = yearPayFactory(o.agi, o.growth);
  const cap = standard10(o.balance, o.rate);
  let principal = o.balance; let accrued = 0; let paid = 0; let m = 0; let pay = 0;
  const r = o.rate / 100 / 12; const balances = [principal]; const payments: number[] = [];
  const limit = o.newBorrower ? P.ibr.newPayments : P.ibr.oldPayments;
  while (principal + accrued > 0.005 && m < limit) {
    if (m % 12 === 0) { pay = ibrPayment({ agi: income(m / 12), familySize: o.familySize, area: o.area, newBorrower: o.newBorrower, filing: o.filing, spouseAgi: o.spouseAgi ? o.spouseAgi * Math.pow(1 + o.growth / 100, m / 12) : 0, balance: o.balance, rate: o.rate, stdCap: cap }).payment; payments.push(pay); }
    accrued += principal * r;
    const p = Math.min(pay, principal + accrued);
    const toInterest = Math.min(p, accrued);
    accrued -= toInterest; principal -= p - toInterest; paid += p; m++;
    if (m % 12 === 0) balances.push(Math.max(0, principal + accrued));
  }
  const left = Math.max(0, principal + accrued);
  const paidOff = left <= 0.005;
  if (!paidOff && m % 12 !== 0) balances.push(left);
  return { plan: 'ibr', firstPayment: payments[0] ?? 0, months: m, totalPaid: paid, forgiven: paidOff ? 0 : left, interestWaived: 0, matched: 0, paidOff, balances, payments };
}

/** A fixed-payment plan (10-year standard or Tiered Standard), with optional extra payment each month. */
export function simulateFixed(balance: number, rate: number, months: number, extra = 0, plan = 'standard'): SimResult {
  const base = months === 120 ? standard10(balance, rate) : Math.max(Math.min(P.standard.minPayment, balance), amortized(balance, rate, months));
  const pay = base + Math.max(0, extra);
  let principal = balance; let paid = 0; let m = 0; const r = rate / 100 / 12; const balances = [principal];
  while (principal > 0.005 && m < 600) {
    const interest = principal * r; const p = Math.min(pay, principal + interest);
    principal = principal + interest - p; paid += p; m++;
    if (m % 12 === 0) balances.push(Math.max(0, principal));
  }
  if (m % 12 !== 0) balances.push(0);
  return { plan, firstPayment: base, months: m, totalPaid: paid, forgiven: 0, interestWaived: 0, matched: 0, paidOff: true, balances, payments: [pay] };
}

export interface CompareInput { balance: number; rate: number; agi: number; familySize: number; dependents: number; area?: Area; filing?: Filing; spouseAgi?: number; growth: number; newLoanAfterJuly2026: boolean; newBorrower2014: boolean }
/**
 * Every plan open to this borrower after the reform. A borrower with a Direct Loan made on or after
 * July 1, 2026 chooses only between Tiered Standard and RAP for all loans (HEA 455(d)(7)(A), (C);
 * 34 CFR 685.209(d)(5)); otherwise IBR and the 10-year standard stay open.
 */
export function comparePlans(i: CompareInput) {
  const tier = tieredStandard(i.balance, i.rate);
  const plans: SimResult[] = [];
  plans.push(simulateRap({ balance: i.balance, rate: i.rate, agi: i.agi, growth: i.growth, dependents: i.dependents, filing: i.filing, spouseAgi: i.spouseAgi }));
  if (!i.newLoanAfterJuly2026) plans.push(simulateIbr({ balance: i.balance, rate: i.rate, agi: i.agi, growth: i.growth, familySize: i.familySize, area: i.area, newBorrower: i.newBorrower2014, filing: i.filing, spouseAgi: i.spouseAgi }));
  plans.push(simulateFixed(i.balance, i.rate, tier.months, 0, 'tiered'));
  if (!i.newLoanAfterJuly2026) plans.push(simulateFixed(i.balance, i.rate, 120, 0, 'standard'));
  return { plans, tierYears: tier.years };
}

/** Months and interest to pay off a fixed loan with an extra amount each month. */
export function payoff(balance: number, rate: number, payment: number, extra = 0) {
  const r = rate / 100 / 12; let b = balance; let m = 0; let interest = 0; const pay = payment + Math.max(0, extra);
  if (pay <= b * r) return { months: Infinity, interest: Infinity, never: true };
  while (b > 0.005 && m < 1200) { const i = b * r; interest += i; b = b + i - Math.min(pay, b + i); m++; }
  return { months: m, interest, never: false };
}

/** Simple daily interest on a federal loan (365-day year, as servicers compute it) and the interest of a period in school. */
export function dailyInterest(principal: number, rate: number) { return (principal * rate) / 100 / 365; }

/** Months of PSLF still to go and the projected amount forgiven on a given plan payment. */
export function pslfProjection(o: { balance: number; rate: number; payment: number; madeSoFar: number }) {
  const left = Math.max(0, P.pslf.payments - Math.max(0, Math.floor(o.madeSoFar)));
  const r = o.rate / 100 / 12; let principal = o.balance; let accrued = 0; let paid = 0;
  for (let k = 0; k < left && principal + accrued > 0.005; k++) {
    accrued += principal * r; const p = Math.min(o.payment, principal + accrued); const ti = Math.min(p, accrued);
    accrued -= ti; principal -= p - ti; paid += p;
  }
  return { left, years: left / 12, paid, forgiven: Math.max(0, principal + accrued) };
}

/** Student loan interest deduction, 26 U.S.C. 221(b), tax year 2026 phase-out (Rev. Proc. 2025-32 sec. 4.29). */
export function interestDeduction(interestPaid: number, magi: number, filing: Filing) {
  if (filing === 'mfs') return { deduction: 0, reduction: 0, allowed: false, start: 0, end: 0 };
  const [start, end] = filing === 'mfj' ? P.deduction.joint : P.deduction.single;
  const capped = Math.min(Math.max(0, interestPaid), P.deduction.max);
  const ratio = Math.min(1, Math.max(0, (magi - start) / (end - start)));
  const reduction = capped * ratio;
  return { deduction: Math.max(0, capped - reduction), reduction, allowed: true, start, end };
}

/** Annual limits for a Direct Loan borrower, 34 CFR 685.203 and HEA 455(a)(4)-(6). Year 1, 2 or 3+ for undergraduates. */
export function annualLimit(kind: 'dep' | 'ind' | 'grad' | 'prof', year = 1) {
  const L = P.limits;
  const y = Math.min(3, Math.max(1, Math.round(year))) - 1;
  if (kind === 'dep') return { total: L.depUndergrad.total[y], sub: L.depUndergrad.sub[y], aggregate: L.depUndergrad.aggregate };
  if (kind === 'ind') return { total: L.indUndergrad.total[y], sub: L.indUndergrad.sub[y], aggregate: L.indUndergrad.aggregate };
  if (kind === 'grad') return { total: L.grad.annual, sub: 0, aggregate: L.grad.aggregate };
  return { total: L.professional.annual, sub: 0, aggregate: L.professional.aggregate };
}

/** Future value of a college savings account: starting amount plus monthly deposits at an assumed yearly return. */
export function futureValue(start: number, monthly: number, years: number, annualReturn: number) {
  const r = annualReturn / 100 / 12; const n = Math.max(0, Math.round(years * 12));
  if (r === 0) return start + monthly * n;
  return start * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
}
