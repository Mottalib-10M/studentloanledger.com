/**
 * 2026-27 Student Aid Index and Pell Grant estimate, after the FSA "2026-27 SAI and Pell Grant
 * Eligibility Guide" (Formulas A, B and C, Steps 1 to 3) with the tables of Federal Register 2025-10243.
 * Simplified input set: the untaxed additions (IRA deductions, tax-exempt interest, untaxed pensions)
 * and offsets (taxable grants, education credits, work-study) are folded into one optional field each.
 * Rounding: the guide rounds every intermediate value to the nearest dollar, halves away from zero.
 */
import P from '../../data/params-2026.json';
import { poverty, type Area } from './loans';

const S = P.sai;
export const rnd = (x: number) => (x < 0 ? -Math.round(-x) : Math.round(x));

type FilingStatus = 'single' | 'mfj' | 'mfs';
/** Payroll tax allowance (Tables A1, B1, C1): Medicare HI plus OASDI on income earned from work. */
export function payrollTax(earned: number, filing: FilingStatus) {
  const e = Math.max(0, earned);
  const hiLimit = filing === 'mfj' ? S.hi.joint : filing === 'mfs' ? S.hi.separate : S.hi.single;
  const hi = (Math.min(e, hiLimit) * S.hi.rate) / 100 + (Math.max(0, e - hiLimit) * S.hi.extra) / 100;
  const oasdiBase = filing === 'mfj' ? S.oasdi.joint : S.oasdi.single;
  const oasdi = (Math.min(e, oasdiBase) * S.oasdi.rate) / 100;
  return { hi: rnd(hi), oasdi: rnd(oasdi) };
}

function table(t: { base: number[]; baseSize: number; extra: number }, size: number) {
  const i = Math.round(size) - t.baseSize;
  if (i < 0) return t.base[0];
  if (i < t.base.length) return t.base[i];
  return t.base[t.base.length - 1] + (i - t.base.length + 1) * t.extra;
}
/** Table A5 / C6: contribution from adjusted available income. */
export function assess(aai: number) {
  const a = rnd(aai);
  const T = S.assessment as Array<Array<number | null>>;
  if (a < (T[0][0] as number)) return T[0][1] as number;
  let low = T[0][0] as number;
  for (let k = 1; k < T.length; k++) {
    const [top, base, pct] = T[k] as [number | null, number, number];
    if (top === null || a <= top) return rnd(k === 1 ? (a * pct) / 100 : base + ((a - low) * pct) / 100);
    low = top;
  }
  return 0;
}
/** Table A3 / B2 / C4: business or farm net worth counted. A family farm lived on or a family business
 *  with 100 or fewer employees is excluded from 2026-27 by HEA 480(f)(2) as amended (Public Law 119-21 sec. 80001). */
export function businessAdjusted(nw: number) {
  if (nw < 1) return 0;
  const T = S.businessNetWorth as Array<[number | null, number, number, number]>;
  for (let k = 1; k < T.length; k++) { const [top, base, from, pct] = T[k]; if (top === null || nw <= top) return rnd(base + ((nw - from) * pct) / 100); }
  return 0;
}

export interface Person { agi: number; taxPaid: number; earned: number; additions?: number; offsets?: number }
export interface SaiInput {
  dependent: boolean;
  /** Parents (dependent) or student and spouse (independent). */
  married: boolean;
  familySize: number;
  area?: Area;
  /** Did the parents (dependent) or the student and spouse (independent) skip filing a federal return? */
  nonFiler?: boolean;
  /** Single parent for the Pell thresholds (Appendix G): unmarried, head of household or EITC filer. */
  singleParent?: boolean;
  filing: FilingStatus;
  parents?: Person;
  student: Person;
  /** Cash, savings, checking + net investments (and child support received), of parents or of the independent student. */
  assets: number;
  studentAssets?: number;
  businessNetWorth?: number;
  childSupport?: number;
}

export interface SaiResult { formula: 'A' | 'B' | 'C'; sai: number; parts: Array<[string, number]>; maxPell: boolean; minPell: boolean; maxPellIndicator: number; pell: number; pellNote: string; thresholds: { max: number; min: number } }

const income = (p: Person) => rnd(p.agi + Math.max(0, p.additions ?? 0) - Math.max(0, p.offsets ?? 0));

export function sai(i: SaiInput): SaiResult {
  const area = i.area ?? 'us';
  const pov = poverty(i.familySize, area, '2024');
  const parts: Array<[string, number]> = [];
  let total = 0; let formula: 'A' | 'B' | 'C' = 'A';
  const hasDeps = !i.dependent && (i.married ? i.familySize >= 3 : i.familySize >= 2);
  if (i.dependent) {
    const p = i.parents ?? { agi: 0, taxPaid: 0, earned: 0 };
    const tpi = income(p);
    const pt = payrollTax(p.earned, i.filing);
    const ipa = table(S.ipaParent, i.familySize);
    const eea = rnd(Math.min(S.eeaMax, (Math.max(0, p.earned) * S.eeaPct) / 100));
    const pai = tpi - (Math.max(0, p.taxPaid) + pt.hi + pt.oasdi + ipa + eea);
    const nw = Math.max(0, i.childSupport ?? 0) + Math.max(0, i.assets) + businessAdjusted(i.businessNetWorth ?? 0);
    const pca = Math.max(0, rnd((nw - 0) * S.parentAssetRate / 100));
    const paai = pai + pca;
    const pc = assess(paai);
    const st = i.student;
    const tsi = income(st);
    const spt = payrollTax(st.earned, 'single');
    const negAllow = paai < 0 ? -paai : 0;
    const sai2 = tsi - (Math.max(0, st.taxPaid) + spt.hi + spt.oasdi + S.ipaDependentStudent + negAllow);
    const sci = Math.max(0, rnd((sai2 * S.studentIncomeRate) / 100));
    const sca = Math.max(0, rnd((Math.max(0, i.studentAssets ?? 0) * S.studentAssetRateDep) / 100));
    parts.push(['Parents’ total income', tpi], ['Allowances against parents’ income', -(Math.max(0, p.taxPaid) + pt.hi + pt.oasdi + ipa + eea)], ['Parents’ available income', pai], ['Parents’ contribution from assets (12%)', pca], ['Parents’ contribution', pc], ['Student’s contribution from income (50%)', sci], ['Student’s contribution from assets (20%)', sca]);
    total = pc + sci + sca;
  } else if (!hasDeps) {
    formula = 'B';
    const st = i.student;
    const ti = income(st);
    const pt = payrollTax(st.earned, i.filing);
    const ipa = i.married ? S.ipaIndNoDep.married : S.ipaIndNoDep.single;
    const eea = i.married ? rnd(Math.min(S.eeaMax, (Math.max(0, st.earned) * S.eeaPct) / 100)) : 0;
    const stai = ti - (Math.max(0, st.taxPaid) + pt.hi + pt.oasdi + ipa + eea);
    const sci = rnd((stai * S.studentIncomeRate) / 100);
    const nw = Math.max(0, i.childSupport ?? 0) + Math.max(0, i.assets) + businessAdjusted(i.businessNetWorth ?? 0);
    const sca = Math.max(0, rnd((nw * S.indNoDepAssetRate) / 100));
    parts.push(['Total income', ti], ['Allowances against income', -(Math.max(0, st.taxPaid) + pt.hi + pt.oasdi + ipa + eea)], ['Available income', stai], ['Contribution from income (50%)', sci], ['Contribution from assets (20%)', sca]);
    total = sci + sca;
  } else {
    formula = 'C';
    const st = i.student;
    const ti = income(st);
    const pt = payrollTax(st.earned, i.filing);
    const ipa = i.married ? table(S.ipaIndMarriedDep, i.familySize) : table(S.ipaIndSingleDep, i.familySize);
    const eea = rnd(Math.min(S.eeaMax, (Math.max(0, st.earned) * S.eeaPct) / 100));
    const stai = ti - (Math.max(0, st.taxPaid) + pt.hi + pt.oasdi + ipa + eea);
    const nw = Math.max(0, i.childSupport ?? 0) + Math.max(0, i.assets) + businessAdjusted(i.businessNetWorth ?? 0);
    const sca = Math.max(0, rnd((nw * S.indDepAssetRate) / 100));
    const aai = stai + sca;
    const c = assess(aai);
    parts.push(['Total income', ti], ['Allowances against income', -(Math.max(0, st.taxPaid) + pt.hi + pt.oasdi + ipa + eea)], ['Available income', stai], ['Contribution from assets (7%)', sca], ['Adjusted available income', aai], ['Contribution from adjusted available income', c]);
    total = c;
  }
  let value = Math.max(S.floor, Math.min(999999, rnd(total)));
  // Step 1: maximum Pell.
  const agi = i.dependent ? (i.parents?.agi ?? 0) : i.student.agi;
  const maxPct = i.singleParent ? P.pell.maxPellAgiPct.singleParent : P.pell.maxPellAgiPct.other;
  const maxLine = rnd((pov * maxPct) / 100);
  let maxPellIndicator = 0;
  if (i.nonFiler) { maxPellIndicator = 1; value = S.floor; }
  else if (agi > 0 && agi <= maxLine) { maxPellIndicator = i.singleParent ? 2 : 3; value = Math.min(value, 0); }
  // Step 3: minimum Pell thresholds.
  const mp = P.pell.minPellAgiPct;
  const isParent = !i.dependent && hasDeps;
  const minPct = i.dependent ? (i.singleParent ? mp.depSingleParent : mp.depOther) : isParent ? (i.singleParent ? mp.indSingleParent : mp.indParent) : mp.indNoChild;
  const minLine = rnd((pov * minPct) / 100);
  const minPellOk = agi <= minLine;
  const max = P.pell.max; const min = (max * P.pell.minPct) / 100;
  let pell = 0; let pellNote = '';
  if (maxPellIndicator > 0 || value <= 0) { pell = max; pellNote = 'Maximum Pell Grant'; }
  else if (value <= max - min) { pell = max - value; pellNote = 'Maximum minus SAI'; }
  else if (minPellOk && value < P.pell.highSaiMultiple * max) { pell = min; pellNote = 'Minimum Pell Grant (income under the minimum-Pell line)'; }
  else { pell = 0; pellNote = value >= P.pell.highSaiMultiple * max ? 'SAI at or above twice the maximum Pell Grant: no Pell Grant (rule in force from July 1, 2026)' : 'No Pell Grant at this SAI'; }
  return { formula, sai: value, parts, maxPell: maxPellIndicator > 0 || value <= 0, minPell: minPellOk, maxPellIndicator, pell, pellNote, thresholds: { max: maxLine, min: minLine } };
}
