/** What a former SAVE payment becomes on the plans still open (SAVE formula shown for reference only). */
import type { MiniSpec } from '../mini-types';
import { saveFormula, rapPayment, ibrPayment, tieredStandard } from '../engine/loans';
import { usd, sizes } from './_kit';
export default (): MiniSpec => ({
  title: 'From SAVE to the plans still open',
  cta: 'Run the full comparison with your rate and raises',
  ctaHref: '/en/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 46000, unit: '$', max: 5000000 },
    { id: 'n', label: 'Household size', def: 1, options: sizes(8) },
    { id: 'b', label: 'Loan balance', def: 42000, unit: '$', max: 2000000 },
  ],
  run: (v) => {
    const save = saveFormula(v.agi, v.n).payment;
    const rap = rapPayment({ agi: v.agi, dependents: Math.max(0, v.n - 1) }).payment;
    const ibr = ibrPayment({ agi: v.agi, familySize: v.n, newBorrower: true, balance: v.b, rate: 6.5 }).payment;
    const tier = tieredStandard(v.b, 6.5);
    return { head: ['Lowest payment now open', usd(Math.min(rap, ibr, tier.payment))], rows: [['Old SAVE formula (undergraduate loans)', usd(save)], ['RAP', usd(rap)], ['IBR, borrower since July 2014', usd(ibr)], [`Tiered Standard (${tier.years} years, 6.5%)`, usd(tier.payment)]] };
  },
});
