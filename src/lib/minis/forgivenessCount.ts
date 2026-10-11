/** Payments left to income-driven forgiveness on each plan, from the payments already counted. */
import type { MiniSpec } from '../mini-types';
import { P } from './_kit';
export default (): MiniSpec => ({
  title: 'Payments left to income-driven forgiveness',
  cta: 'Estimate the amount forgiven',
  ctaHref: '/en/student-loan-forgiveness/',
  inputs: [
    { id: 'q', label: 'Qualifying payments already counted', def: 96, unit: 'payments', max: 360 },
    { id: 'o', label: 'Owed a federal loan before July 1, 2014?', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: (v) => {
    const q = Math.max(0, Math.round(v.q));
    const ibrN = v.o === 1 ? P.ibr.oldPayments : P.ibr.newPayments;
    const ibr = Math.max(0, ibrN - q); const rap = Math.max(0, P.rap.payments - q);
    return { head: ['Earliest forgiveness (IBR)', `${ibr} payments`], rows: [[`IBR (${ibrN} total)`, `${ibr} left, about ${(ibr / 12).toFixed(1)} years`], [`RAP (${P.rap.payments} total)`, `${rap} left, about ${(rap / 12).toFixed(1)} years`], [`PSLF (${P.pslf.payments} total, public service only)`, `${Math.max(0, P.pslf.payments - q)} left`]], note: 'Assumes the same months count for each program, which is not always true.' };
  },
});
