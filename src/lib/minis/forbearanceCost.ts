/** Interest that accrues during months without payments (forbearance, or deferment of unsubsidized loans). */
import type { MiniSpec } from '../mini-types';
import { rapPayment } from '../engine/loans';
import { P, usd } from './_kit';
export default (): MiniSpec => ({
  title: 'What a pause costs in interest',
  cta: 'Compare a RAP payment instead',
  ctaHref: '/en/rap-calculator/',
  inputs: [
    { id: 'b', label: 'Unsubsidized balance', def: 35000, unit: '$', max: 2000000 },
    { id: 'm', label: 'Months without payments', def: 9, unit: 'months', max: 60 },
    { id: 'agi', label: 'Your current AGI (for RAP)', def: 18000, unit: '$', max: 5000000 },
  ],
  run: (v) => {
    const interest = (v.b * P.rates.current.undergrad) / 1200 * v.m;
    const rap = rapPayment({ agi: v.agi, dependents: 0 }).payment;
    return { head: ['Interest accrued during the pause', usd(interest)], rows: [[`Rate used`, `${P.rates.current.undergrad}%`], ['RAP payment instead, per month', usd(rap)], ['RAP paid over the same months', usd(rap * v.m)]], note: 'On RAP, on-time payments waive the interest they do not cover.' };
  },
});
