/** RAP and IBR for a married borrower: joint return against separate return (34 CFR 685.209(e), (g)). */
import type { MiniSpec } from '../mini-types';
import { rapPayment, ibrPayment } from '../engine/loans';
import { usd, deps } from './_kit';
export default (): MiniSpec => ({
  title: 'Joint or separate return: your loan payment',
  cta: 'Compare every plan with your balance',
  ctaHref: '/en/',
  inputs: [
    { id: 'a', label: 'Your AGI', def: 45000, unit: '$', max: 5000000 },
    { id: 's', label: 'Spouse’s AGI', def: 65000, unit: '$', max: 5000000 },
    { id: 'd', label: 'Children claimed', def: 1, options: deps() },
  ],
  run: (v) => {
    const rapJ = rapPayment({ agi: v.a, spouseAgi: v.s, filing: 'mfj', dependents: v.d }).payment;
    const rapS = rapPayment({ agi: v.a, filing: 'mfs', dependents: v.d }).payment;
    const ibrJ = ibrPayment({ agi: v.a, spouseAgi: v.s, filing: 'mfj', familySize: 2 + v.d, newBorrower: true, balance: 1e7, rate: 6.5 }).payment;
    const ibrS = ibrPayment({ agi: v.a, filing: 'mfs', familySize: 1 + v.d, newBorrower: true, balance: 1e7, rate: 6.5 }).payment;
    return { head: ['Monthly saving filing separately (RAP)', usd(Math.max(0, rapJ - rapS))], rows: [['RAP, joint return', usd(rapJ)], ['RAP, separate return (children on your return)', usd(rapS)], ['IBR, joint return', usd(ibrJ)], ['IBR, separate return', usd(ibrS)]], note: 'Spouse without federal loans. Separate returns usually cost tax; compare both.' };
  },
});
