/**
 * The data kit: every figure a page may print, read from params-2026.json or computed by the engines.
 * Pages never type a rate, a limit or a date that exists here (RECETTE §17.4, point 7).
 */
import P from '../data/params-2026.json';
import * as L from './engine/loans';
import { sai, payrollTax, assess, businessAdjusted } from './engine/sai';
import { usd, usdx, pct, num, day, listOf, ym } from './fmt';

const R = P.rates.current;
/** Minimum Pell Grant: 10% of the total maximum (20 U.S.C. 1070a(a)(3)(F)). */
const pellMin = (P.pell.max * P.pell.minPct) / 100;

export const KIT = {
  P, R,
  ...L,
  sai, payrollTax, assess, businessAdjusted,
  usd, usdx, pct, num, day, listOf, ym,
  pellMin,
  /** Interest of the first month on a balance, at a yearly rate in percent. */
  monthInterest: (balance: number, rate: number) => (balance * rate) / 100 / 12,
  /** IBR income line: 150% of the 2026 poverty guideline for a family size. */
  ibrLine: (size: number, area: L.Area = 'us') => (L.poverty(size, area) * P.ibr.povertyPct) / 100,
};
export type Kit = typeof KIT;
export { P, R, pellMin };
export const { poverty, amortized, standard10, tierYears, tieredStandard, rapBase, rapPayment, ibrPayment, saveFormula, simulateRap, simulateIbr, simulateFixed, comparePlans, payoff, dailyInterest, pslfProjection, interestDeduction, annualLimit, futureValue } = L;
export { sai, payrollTax, assess, businessAdjusted, usd, usdx, pct, num, day, listOf, ym };
export const ibrLine = KIT.ibrLine;
export const monthInterest = KIT.monthInterest;
