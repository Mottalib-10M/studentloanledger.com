/** Starting rehabilitation payment: the IDR payment, with a $5 floor before July 1, 2027 and $10 after (34 CFR 685.211(f)). */
import type { MiniSpec } from '../mini-types';
import { rapPayment, ibrPayment } from '../engine/loans';
import { usd, sizes } from './_kit';
export default (): MiniSpec => ({
  title: 'Your likely rehabilitation payment',
  cta: 'See the payment on each plan after rehabilitation',
  ctaHref: '/en/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 24000, unit: '$', max: 5000000 },
    { id: 'n', label: 'Household size', def: 2, options: sizes(8) },
  ],
  run: (v) => {
    const rap = rapPayment({ agi: v.agi, dependents: Math.max(0, v.n - 1) }).payment;
    const ibr = ibrPayment({ agi: v.agi, familySize: v.n, newBorrower: false, balance: 1e7, rate: 6.5 }).payment;
    const low = Math.min(rap, ibr);
    return { head: ['Lowest IDR-based payment', usd(Math.max(10, low))], rows: [['RAP', usd(rap)], ['IBR at 15%', usd(ibr)], ['Floor before July 1, 2027 / from then', `${usd(5)} / ${usd(10)}`]], note: 'The Department starts from an eligible IDR payment and can adjust it to your finances.' };
  },
});
