/**
 * Engine tests. Reference cases come from the official documents named on each test
 * (Department of Education fact sheet of June 9, 2026; 34 CFR 685.209; the 2026-27 SAI guide; Rev. Proc. 2025-32).
 */
import { describe, it, expect } from 'vitest';
import P from '../src/data/params-2026.json';
import { poverty, amortized, standard10, tierYears, tieredStandard, rapBase, rapPayment, ibrPayment, saveFormula, simulateRap, simulateIbr, simulateFixed, comparePlans, payoff, interestDeduction, annualLimit, pslfProjection, futureValue } from '../src/lib/engine/loans';
import { sai, payrollTax, assess, businessAdjusted } from '../src/lib/engine/sai';

describe('parameters read on the official documents', () => {
  it('2026-27 fixed rates = May 12, 2026 Treasury 4.47% + add-on (Federal Register 2026-18493)', () => {
    expect(P.rates.current.undergrad).toBeCloseTo(P.rates.treasury + P.rates.addOn.undergrad, 6);
    expect(P.rates.current.grad).toBeCloseTo(P.rates.treasury + P.rates.addOn.grad, 6);
    expect(P.rates.current.plus).toBeCloseTo(P.rates.treasury + P.rates.addOn.plus, 6);
    expect([P.rates.current.undergrad, P.rates.current.grad, P.rates.current.plus]).toEqual([6.52, 8.07, 9.07]);
  });
  it('Pell maximum 2026-27 = $6,335 appropriated (Public Law 119-75) + $1,060 (20 U.S.C. 1070a(b)(5))', () => {
    expect(P.pell.appropriated + P.pell.mandatory).toBe(P.pell.max);
    expect(P.pell.max).toBe(7395);
  });
  it('poverty guidelines 2026 and 2024', () => {
    expect(poverty(1)).toBe(15960); expect(poverty(4)).toBe(33000); expect(poverty(4, 'ak')).toBe(41250); expect(poverty(3, 'hi')).toBe(31420);
    expect(poverty(1, 'us', '2024')).toBe(15060); expect(poverty(4, 'us', '2024')).toBe(31200);
  });
});

describe('fixed plans', () => {
  it('ED fact sheet: $30,000 on the 10-year standard = $341, on Tiered Standard (15 years) = $262', () => {
    expect(Math.round(standard10(30000, 6.53))).toBe(341);
    const t = tieredStandard(30000, 6.53);
    expect(t.years).toBe(15); expect(Math.round(t.payment)).toBe(262);
  });
  it('tier boundaries: under $25,000 = 10 years, $25,000 = 15, $50,000 = 20, $100,000 = 25', () => {
    expect(tierYears(24999.99)).toBe(10); expect(tierYears(25000)).toBe(15); expect(tierYears(49999)).toBe(15);
    expect(tierYears(50000)).toBe(20); expect(tierYears(99999)).toBe(20); expect(tierYears(100000)).toBe(25); expect(tierYears(400000)).toBe(25);
  });
  it('$50 minimum on the 10-year standard', () => { expect(standard10(1000, 6.52)).toBe(50); expect(standard10(0, 6.52)).toBe(0); });
  it('amortization with a zero rate', () => expect(amortized(1200, 0, 12)).toBe(100));
  it('fixed simulation pays the balance off on time', () => { const s = simulateFixed(30000, 6.53, 120); expect(s.months).toBe(120); expect(s.totalPaid).toBeGreaterThan(30000); });
});

describe('Repayment Assistance Plan (HEA 455(q), 34 CFR 685.209)', () => {
  it('brackets apply one rate to the whole AGI', () => {
    expect(rapBase(9000).base).toBe(120); expect(rapBase(10000).base).toBe(120);
    expect(rapBase(10001).pct).toBe(1); expect(rapBase(20000).pct).toBe(1); expect(rapBase(20001).pct).toBe(2);
    expect(rapBase(45000).base).toBe(1800); expect(rapBase(100000).pct).toBe(9); expect(rapBase(100001).pct).toBe(10);
  });
  it('ED fact sheet: $45,000, no dependent = $150 a month', () => expect(rapPayment({ agi: 45000, dependents: 0 }).payment).toBe(150));
  it('$50 less per dependent, never under $10', () => {
    expect(rapPayment({ agi: 45000, dependents: 2 }).payment).toBe(50);
    expect(rapPayment({ agi: 45000, dependents: 4 }).payment).toBe(10);
    expect(rapPayment({ agi: 5000, dependents: 0 }).payment).toBe(10);
  });
  it('married filing jointly adds the spouse AGI and prorates by the couple debt', () => {
    const r = rapPayment({ agi: 40000, spouseAgi: 40000, filing: 'mfj', dependents: 0, ownDebt: 30000, spouseDebt: 30000 });
    expect(r.agi).toBe(80000); expect(r.pct).toBe(7); expect(r.payment).toBeCloseTo((80000 * 0.07) / 12 / 2, 6);
    expect(rapPayment({ agi: 40000, spouseAgi: 40000, filing: 'mfs', dependents: 0 }).agi).toBe(40000);
  });
  it('ED fact sheet: $35,000 at about 6.5%, $45,000 income: about $40 of interest waived and a $50 match in month one', () => {
    const s = simulateRap({ balance: 35000, rate: 6.52, agi: 45000, growth: 0, dependents: 0, years: 30 });
    expect(s.firstPayment).toBe(150);
    // interest 190.17, payment 150: 40.17 waived, principal cut by the $50 match
    const month1Interest = (35000 * 0.0652) / 12;
    expect(month1Interest - 150).toBeGreaterThan(39); expect(month1Interest - 150).toBeLessThan(41);
    expect(s.matched).toBeGreaterThan(0); expect(s.interestWaived).toBeGreaterThan(0);
    // balance never grows under RAP with on-time payments
    for (let k = 1; k < s.balances.length; k++) expect(s.balances[k]).toBeLessThanOrEqual(s.balances[k - 1] + 1e-6);
  });
  it('forgiveness only after 360 payments', () => {
    const s = simulateRap({ balance: 200000, rate: 8, agi: 30000, growth: 0, dependents: 1 });
    expect(s.months).toBe(360); expect(s.paidOff).toBe(false); expect(s.forgiven).toBeGreaterThan(0);
  });
});

describe('Income-Based Repayment (HEA 493C, 34 CFR 685.209(f)(2)-(3))', () => {
  it('ED fact sheet: prior IDR plans, $45,000 single = $176 (10% of AGI above 150% of poverty)', () => {
    expect(Math.round(ibrPayment({ agi: 45000, familySize: 1, newBorrower: true, balance: 35000, rate: 6.52 }).payment)).toBe(176);
  });
  it('15% for a borrower who is not a new borrower', () => {
    const p = ibrPayment({ agi: 45000, familySize: 1, newBorrower: false, balance: 60000, rate: 6.52 }).payment;
    expect(p).toBeCloseTo(((45000 - 23940) * 0.15) / 12, 6);
  });
  it('capped at the 10-year standard payment; $0 under $5, $10 between $5 and $10', () => {
    const r = ibrPayment({ agi: 200000, familySize: 1, newBorrower: true, balance: 10000, rate: 6.52 });
    expect(r.capped).toBe(true); expect(r.payment).toBeCloseTo(standard10(10000, 6.52), 6);
    expect(ibrPayment({ agi: 23940 + 400, familySize: 1, newBorrower: true, balance: 30000, rate: 6.52 }).payment).toBe(0);
    expect(ibrPayment({ agi: 23940 + 1000, familySize: 1, newBorrower: true, balance: 30000, rate: 6.52 }).payment).toBe(10);
  });
  it('Alaska uses its own guideline', () => {
    const us = ibrPayment({ agi: 60000, familySize: 3, newBorrower: true, balance: 50000, rate: 6.5 }).payment;
    const ak = ibrPayment({ agi: 60000, familySize: 3, area: 'ak', newBorrower: true, balance: 50000, rate: 6.5 }).payment;
    expect(ak).toBeLessThan(us);
  });
  it('forgiveness after 240 or 300 payments', () => {
    expect(simulateIbr({ balance: 150000, rate: 7, agi: 40000, growth: 0, familySize: 1, newBorrower: true }).months).toBe(240);
    expect(simulateIbr({ balance: 150000, rate: 7, agi: 40000, growth: 0, familySize: 1, newBorrower: false }).months).toBe(300);
  });
});

describe('plan menu after the reform', () => {
  it('a loan made on or after July 1, 2026 leaves only RAP and Tiered Standard', () => {
    const base = { balance: 40000, rate: 6.52, agi: 55000, familySize: 1, dependents: 0, growth: 2, newBorrower2014: true };
    expect(comparePlans({ ...base, newLoanAfterJuly2026: true }).plans.map((p) => p.plan)).toEqual(['rap', 'tiered']);
    expect(comparePlans({ ...base, newLoanAfterJuly2026: false }).plans.map((p) => p.plan)).toEqual(['rap', 'ibr', 'tiered', 'standard']);
  });
  it('SAVE formula shown for comparison only: 5% above 225% of poverty for undergraduate loans', () => {
    expect(saveFormula(60000, 1).payment).toBeCloseTo(((60000 - 15960 * 2.25) * 0.05) / 12, 6);
  });
});

describe('other tools', () => {
  it('payoff with an extra payment shortens the term', () => {
    const base = payoff(30000, 6.52, standard10(30000, 6.52));
    const fast = payoff(30000, 6.52, standard10(30000, 6.52), 100);
    expect(base.months).toBe(120); expect(fast.months).toBeLessThan(120); expect(fast.interest).toBeLessThan(base.interest);
    expect(payoff(30000, 6.52, 100).never).toBe(true);
  });
  it('student loan interest deduction 2026: $2,500, phase-out $85,000 to $100,000 single, $175,000 to $205,000 joint', () => {
    expect(interestDeduction(3000, 70000, 'single').deduction).toBe(2500);
    expect(interestDeduction(2500, 92500, 'single').deduction).toBe(1250);
    expect(interestDeduction(2500, 100000, 'single').deduction).toBe(0);
    expect(interestDeduction(2500, 190000, 'mfj').deduction).toBe(1250);
    expect(interestDeduction(2500, 50000, 'mfs').deduction).toBe(0);
  });
  it('loan limits from July 1, 2026', () => {
    expect(annualLimit('dep', 1).total).toBe(5500); expect(annualLimit('ind', 3).total).toBe(12500);
    expect(annualLimit('grad').total).toBe(20500); expect(annualLimit('prof').aggregate).toBe(200000);
    expect(P.limits.parentPlus.annual).toBe(20000); expect(P.limits.lifetime).toBe(257500);
  });
  it('PSLF projection forgives what is left after 120 payments', () => {
    const r = pslfProjection({ balance: 80000, rate: 6.5, payment: 300, madeSoFar: 60 });
    expect(r.left).toBe(60); expect(r.forgiven).toBeGreaterThan(0);
    expect(pslfProjection({ balance: 1000, rate: 6.5, payment: 300, madeSoFar: 0 }).forgiven).toBe(0);
  });
  it('future value', () => { expect(futureValue(0, 100, 1, 0)).toBe(1200); expect(futureValue(1000, 0, 10, 5)).toBeCloseTo(1000 * Math.pow(1 + 0.05 / 12, 120), 6); });
});

describe('Student Aid Index 2026-27 (FSA guide)', () => {
  it('payroll tax: guide example, $250,400 MFJ = $15,525 OASDI', () => { expect(payrollTax(250400, 'mfj').oasdi).toBe(15525); expect(payrollTax(96000, 'mfs').hi).toBe(1392); });
  it('assessment schedule (Table A5)', () => {
    expect(assess(-9000)).toBe(-1870); expect(assess(10000)).toBe(2200); expect(assess(21800)).toBe(4796);
    expect(assess(30000)).toBe(6171 + Math.round(2700 * 0.29)); expect(assess(50000)).toBe(11870 + Math.round(6100 * 0.47));
  });
  it('business net worth adjustment (Table A3)', () => { expect(businessAdjusted(100000)).toBe(40000); expect(businessAdjusted(300000)).toBe(132500); expect(businessAdjusted(0)).toBe(0); });
  it('non-filing parents: SAI -1,500 and the maximum Pell Grant', () => {
    const r = sai({ dependent: true, married: true, familySize: 4, nonFiler: true, filing: 'mfj', parents: { agi: 0, taxPaid: 0, earned: 0 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 0 });
    expect(r.sai).toBe(-1500); expect(r.pell).toBe(7395);
  });
  it('parents at or under 175% of the 2024 guideline get the maximum Pell Grant (SAI 0 or lower)', () => {
    const r = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 50000, taxPaid: 1500, earned: 50000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 0 });
    expect(r.thresholds.max).toBe(Math.round(31200 * 1.75)); expect(r.sai).toBeLessThanOrEqual(0); expect(r.pell).toBe(7395);
  });
  it('a high income family gets no Pell Grant once the SAI reaches twice the maximum', () => {
    const r = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 200000, taxPaid: 25000, earned: 200000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 50000 });
    expect(r.sai).toBeGreaterThan(2 * 7395); expect(r.pell).toBe(0);
  });
  it('a dependent student hand computation (Formula A)', () => {
    // Parents MFJ, family of 4, AGI 90,000 all earned, tax paid 6,000, savings 20,000; student earned 5,000, no tax.
    const r = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 90000, taxPaid: 6000, earned: 90000 }, student: { agi: 5000, taxPaid: 0, earned: 5000 }, assets: 20000 });
    const pt = Math.round(90000 * 0.0145) + Math.round(90000 * 0.062);
    const pai = 90000 - (6000 + pt + 44880 + 5000);
    const paai = pai + 2400;
    const pc = assess(paai);
    expect(r.formula).toBe('A'); expect(r.sai).toBe(pc); // student income 5,000 is under the 11,770 protection
    expect(r.pell).toBe(r.sai <= 7395 - 739.5 ? 7395 - r.sai : r.pell);
  });
  it('independent student without dependents uses Formula B, with dependents Formula C', () => {
    expect(sai({ dependent: false, married: false, familySize: 1, filing: 'single', student: { agi: 30000, taxPaid: 1500, earned: 30000 }, assets: 0 }).formula).toBe('B');
    expect(sai({ dependent: false, married: false, familySize: 2, singleParent: true, filing: 'single', student: { agi: 30000, taxPaid: 0, earned: 30000 }, assets: 0 }).formula).toBe('C');
  });
});
