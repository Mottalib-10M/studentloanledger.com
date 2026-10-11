/** Months left to PSLF and the hours test (34 CFR 685.219). */
import type { MiniSpec } from '../mini-types';
import { P, usd } from './_kit';
import { rapPayment } from '../engine/loans';
export default (): MiniSpec => ({
  title: 'How far you are from PSLF',
  cta: 'Project the amount forgiven',
  ctaHref: '/en/pslf-calculator/',
  inputs: [
    { id: 'q', label: 'Qualifying payments counted', def: 54, unit: 'payments', max: 120 },
    { id: 'h', label: 'Average hours worked per week', def: 32, unit: 'hours', max: 100 },
    { id: 'agi', label: 'Your AGI (RAP payment)', def: 52000, unit: '$', max: 5000000 },
  ],
  run: (v) => {
    const left = Math.max(0, P.pslf.payments - Math.round(v.q));
    const full = v.h >= P.pslf.hoursPerWeek;
    const pay = rapPayment({ agi: v.agi, dependents: 0 }).payment;
    return { head: [full ? 'Payments left' : 'Not full time yet', full ? String(left) : `${P.pslf.hoursPerWeek} hours needed`], rows: [['Years left at one payment a month', (left / 12).toFixed(1)], ['RAP payment, single, no dependent', usd(pay)], ['Paid until forgiveness on RAP', usd(pay * left)]] };
  },
});
