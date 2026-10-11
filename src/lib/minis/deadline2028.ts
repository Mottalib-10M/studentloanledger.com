/** Where PAYE or ICR loans land on July 1, 2028 without a choice, and what a deliberate choice could cost instead. */
import type { MiniSpec } from '../mini-types';
import { rapPayment, ibrPayment } from '../engine/loans';
import { usd, deps } from './_kit';
export default (): MiniSpec => ({
  title: 'PAYE or ICR borrower: your options before July 1, 2028',
  cta: 'Compare every plan with your balance',
  ctaHref: '/en/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 62000, unit: '$', max: 5000000 },
    { id: 'd', label: 'Dependents', def: 1, options: deps() },
    { id: 'p', label: 'Parent PLUS consolidation?', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: (v) => {
    const rap = rapPayment({ agi: v.agi, dependents: v.d }).payment;
    const ibrNew = ibrPayment({ agi: v.agi, familySize: 1 + v.d, newBorrower: true, balance: 1e7, rate: 6.5 }).payment;
    const ibrOld = ibrPayment({ agi: v.agi, familySize: 1 + v.d, newBorrower: false, balance: 1e7, rate: 6.5 }).payment;
    if (v.p === 1) return { head: ['Default placement: IBR', usd(ibrOld)], rows: [['IBR at 15%', usd(ibrOld)], ['IBR at 10% (new borrower)', usd(ibrNew)], ['RAP', 'not available']], note: 'A consolidation that repaid parent PLUS goes to IBR if RAP cannot take it.' };
    return { head: ['Default placement: RAP', usd(rap)], rows: [['RAP', usd(rap)], ['IBR at 10% (new borrower)', usd(ibrNew)], ['IBR at 15%', usd(ibrOld)]], note: 'IBR shown before its 10-year cap.' };
  },
});
