/** One month on RAP: interest charged, interest waived, matching principal payment (34 CFR 685.209(h)(4), (o)(2)). */
import type { MiniSpec } from '../mini-types';
import { rapPayment } from '../engine/loans';
import { P, usd, deps } from './_kit';
export default (): MiniSpec => ({
  title: 'One month on RAP, split line by line',
  cta: 'See the whole plan in the RAP calculator',
  ctaHref: '/en/rap-calculator/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 36000, unit: '$', max: 5000000 },
    { id: 'd', label: 'Dependents', def: 0, options: deps() },
    { id: 'b', label: 'Loan balance', def: 48000, unit: '$', max: 2000000 },
  ],
  run: (v) => {
    const pay = rapPayment({ agi: v.agi, dependents: v.d }).payment;
    const interest = (v.b * P.rates.current.undergrad) / 1200;
    const toInt = Math.min(pay, interest); const toPrin = Math.max(0, pay - interest);
    const waived = interest - toInt;
    const match = toPrin < P.rap.matchMax ? Math.max(0, Math.min(P.rap.matchMax, pay) - toPrin) : 0;
    return { head: ['Balance falls this month by', usd(toPrin + match)], rows: [['Your on-time payment', usd(pay)], [`Interest at ${P.rates.current.undergrad}%`, usd(interest)], ['Interest waived', usd(waived)], ['Matching principal payment', usd(match)]] };
  },
});
