/** RAP, IBR and the old SAVE formula side by side for one income (SAVE shown as a reference only). */
import type { MiniSpec } from '../mini-types';
import { rapPayment, ibrPayment, saveFormula } from '../engine/loans';
import { usd, sizes } from './_kit';
export default (): MiniSpec => ({
  title: 'Three income-driven formulas, one income',
  cta: 'Compare with your balance and the fixed plans',
  ctaHref: '/en/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 38000, unit: '$', max: 5000000 },
    { id: 'n', label: 'Household size', def: 2, options: sizes(8) },
  ],
  run: (v) => {
    const rap = rapPayment({ agi: v.agi, dependents: Math.max(0, v.n - 1) }).payment;
    const ibr = ibrPayment({ agi: v.agi, familySize: v.n, newBorrower: true, balance: 1e7, rate: 6.5 }).payment;
    const save = saveFormula(v.agi, v.n).payment;
    return { head: ['Lowest open plan', usd(Math.min(rap, ibr))], rows: [['RAP (others counted as dependents)', usd(rap)], ['IBR, borrower since July 2014', usd(ibr)], ['Former SAVE formula, closed', usd(save)]], note: 'IBR before its cap; SAVE no longer takes payments under its formula.' };
  },
});
