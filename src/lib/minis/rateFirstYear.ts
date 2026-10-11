/** First-year interest on a new 2026-27 Direct Loan (rates: Federal Register 2026-18493, HEA 455(b)). */
import type { MiniSpec } from '../mini-types';
import { P, usd, pct } from './_kit';
const KINDS = ['undergrad', 'grad', 'plus'] as const;
export default (): MiniSpec => ({
  title: 'Interest in the first year of a new loan',
  cta: 'See how interest builds day by day',
  ctaHref: '/en/student-loan-interest-calculator/',
  inputs: [
    { id: 'k', label: 'Loan type', def: 0, options: [{ value: '0', label: 'Undergraduate (subsidized or unsubsidized)' }, { value: '1', label: 'Graduate or professional unsubsidized' }, { value: '2', label: 'PLUS (parent or graduate)' }] },
    { id: 'amt', label: 'Amount borrowed', def: 5500, unit: '$', max: 500000 },
  ],
  run: (v) => {
    const k = KINDS[Math.min(2, Math.max(0, Math.round(v.k)))];
    const rate = P.rates.current[k];
    const year = (v.amt * rate) / 100;
    return {
      head: ['Interest over the first 12 months', usd(year)],
      rows: [
        ['Fixed rate for 2026-27', pct(rate)],
        ['How it is built', `${pct(P.rates.treasury)} Treasury + ${pct(P.rates.addOn[k])} add-on, cap ${pct(P.rates.cap[k])}`],
        ['Interest per month', usd(year / 12)],
        ['Interest per day', usd(year / 365, 2)],
      ],
      note: 'Simple interest on the amount disbursed, before any payment. Subsidized loans are not charged interest while you are in school at least half time.',
    };
  },
});
