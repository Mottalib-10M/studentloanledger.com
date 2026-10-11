/** RAP against IBR for one income and household (engine: lib/engine/loans.ts). */
import type { MiniSpec } from '../mini-types';
import { rapPayment, ibrPayment } from '../engine/loans';
import { P, usd, deps } from './_kit';
export default (): MiniSpec => ({
  title: 'RAP or IBR at your income',
  cta: 'Run the full comparison with your balance',
  ctaHref: '/en/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 40000, unit: '$', max: 5000000 },
    { id: 'd', label: 'Dependents', def: 1, options: deps() },
  ],
  run: (v) => {
    const rap = rapPayment({ agi: v.agi, dependents: v.d }).payment;
    const ibr = ibrPayment({ agi: v.agi, familySize: 1 + v.d, newBorrower: true, balance: 1e7, rate: 6.5 }).payment;
    const ibrOld = ibrPayment({ agi: v.agi, familySize: 1 + v.d, newBorrower: false, balance: 1e7, rate: 6.5 }).payment;
    const best = rap <= ibr ? 'RAP' : 'IBR';
    return { head: [`Lower monthly payment: ${best}`, usd(Math.min(rap, ibr))], rows: [['RAP', usd(rap)], [`IBR, borrower since July 2014 (${P.ibr.newPct}%)`, usd(ibr)], [`IBR, earlier borrower (${P.ibr.oldPct}%)`, usd(ibrOld)]], note: 'IBR shown before its 10-year standard cap, which can lower it for small balances.' };
  },
});
