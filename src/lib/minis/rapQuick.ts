/** RAP payment from AGI and dependents (HEA 455(q), 34 CFR 685.209(f)(5)). */
import type { MiniSpec } from '../mini-types';
import { rapPayment } from '../engine/loans';
import { P, usd, deps } from './_kit';
export default (): MiniSpec => ({
  title: 'Your RAP payment in two numbers',
  cta: 'Compare it with IBR and Tiered Standard',
  ctaHref: '/en/',
  inputs: [
    { id: 'agi', label: 'Adjusted gross income', def: 45000, unit: '$', max: 5000000 },
    { id: 'd', label: 'Dependents', def: 0, options: deps() },
  ],
  run: (v) => {
    const r = rapPayment({ agi: v.agi, dependents: v.d });
    return { head: ['RAP monthly payment', usd(r.payment)], rows: [['Bracket rate on the whole AGI', r.pct === 0 ? `flat $${P.rap.floorBase} a year` : `${r.pct}%`], ['Yearly base payment', usd(r.base)], ['Taken off for dependents', usd(P.rap.perDependent * v.d)]] };
  },
});
