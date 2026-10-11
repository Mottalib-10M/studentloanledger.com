/** Room left under the $257,500 lifetime federal loan limit (HEA 455(a)(6); 34 CFR 685.203(j)(2)). */
import type { MiniSpec } from '../mini-types';
import { P, usd, num } from './_kit';
export default (): MiniSpec => ({
  title: 'Room left under the lifetime limit',
  cta: 'See every annual and aggregate limit',
  ctaHref: '/en/how-much-student-loan-can-i-get/',
  inputs: [
    { id: 'past', label: 'Federal loans borrowed as a student, ever', def: 62000, unit: '$', max: 2000000 },
    { id: 'yr', label: 'Federal loans you plan per year', def: 20500, unit: '$', max: 500000 },
  ],
  run: (v) => {
    const room = Math.max(0, P.limits.lifetime - Math.max(0, v.past));
    const years = v.yr > 0 ? room / v.yr : 0;
    return {
      head: ['Left under the lifetime limit', usd(room)],
      rows: [
        ['Already used', usd(Math.min(P.limits.lifetime, Math.max(0, v.past)))],
        ['Years at your pace', v.yr > 0 ? num(years, 1) : 'n/a'],
        ['Share of the limit used', `${num((Math.min(P.limits.lifetime, Math.max(0, v.past)) / P.limits.lifetime) * 100, 0)}%`],
      ],
      note: 'Count what you borrowed, not what you still owe: repaid and forgiven loans stay in the total. Parent PLUS taken for a child is left out.',
    };
  },
});
