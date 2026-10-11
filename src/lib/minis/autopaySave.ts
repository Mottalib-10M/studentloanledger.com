/** Interest saved by the auto pay rate reduction (0.25 point usually, 1 point in total under the 2026 offer). */
import type { MiniSpec } from '../mini-types';
import { P, usd } from './_kit';
export default (): MiniSpec => ({
  title: 'What the auto pay rate cut is worth',
  cta: 'See the payoff effect',
  ctaHref: '/en/student-loan-payoff-calculator/',
  inputs: [
    { id: 'b', label: 'Direct Loan balance', def: 40000, unit: '$', max: 2000000 },
    { id: 'r', label: 'Your interest rate', def: P.rates.current.undergrad, unit: '%', max: 20, decimals: 2 },
  ],
  run: (v) => {
    const promo = (v.b * P.autopay.promoCut) / 100; const std = (v.b * P.autopay.standardCut) / 100;
    return { head: ['Interest saved per year with the offer', usd(promo)], rows: [['Rate with the offer', `${Math.max(0, v.r - P.autopay.promoCut).toFixed(2)}%`], [`Usual ${P.autopay.standardCut}-point cut, per year`, usd(std)], ['Extra from the 2026 offer, per year', usd(promo - std)]], note: 'First-year approximation on the current balance.' };
  },
});
