/** Tiered Standard term and payment for a balance (HEA 455(d)(7)(A)(i), 34 CFR 685.208(c)(1)). */
import type { MiniSpec } from '../mini-types';
import { tieredStandard, standard10 } from '../engine/loans';
import { P, usd } from './_kit';
export default (): MiniSpec => ({
  title: 'Your Tiered Standard term',
  cta: 'Compare it with RAP for your income',
  ctaHref: '/en/',
  inputs: [
    { id: 'b', label: 'Total Direct Loan principal', def: 48000, unit: '$', max: 2000000 },
    { id: 'r', label: 'Interest rate', def: P.rates.current.undergrad, unit: '%', max: 20, decimals: 2 },
  ],
  run: (v) => {
    const t = tieredStandard(v.b, v.r); const s = standard10(v.b, v.r);
    return { head: [`Payment over ${t.years} years`, usd(t.payment)], rows: [['10-year payment for comparison', usd(s)], ['Total repaid on Tiered Standard', usd(t.payment * t.months)], ['Total repaid over 10 years', usd(s * 120)]], note: t.payment >= s - 0.005 ? 'Equal to the 10-year amount: counts for PSLF.' : 'Below the 10-year amount: does not count for PSLF.' };
  },
});
