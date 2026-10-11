/** Gap between a graduate program's cost and the federal graduate caps (HEA 455(a)(4), 34 CFR 685.203). */
import type { MiniSpec } from '../mini-types';
import { P, usd } from './_kit';
const G = P.limits.grad;
export default (): MiniSpec => ({
  title: 'What the graduate caps leave uncovered',
  cta: 'See what that federal balance costs to repay',
  ctaHref: '/en/',
  inputs: [
    { id: 'cost', label: 'Yearly cost of attendance', def: 48000, unit: '$', max: 500000 },
    { id: 'aid', label: 'Yearly grants, scholarships, assistantships', def: 6000, unit: '$', max: 500000 },
    { id: 'yrs', label: 'Years in the program', def: 2, options: [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: n === 1 ? '1 year' : `${n} years` })) },
  ],
  run: (v) => {
    const need = Math.max(0, v.cost - v.aid);
    let left = G.aggregate; let fed = 0; let gap = 0;
    for (let y = 0; y < v.yrs; y++) { const loan = Math.min(need, G.annual, left); left -= loan; fed += loan; gap += need - loan; }
    return {
      head: ['Not covered by federal loans', usd(gap)],
      rows: [
        ['Need per year after aid', usd(need)],
        ['Federal loans over the program', usd(fed)],
        ['Room left under the graduate aggregate', usd(left)],
      ],
      note: `Full-time limits: ${usd(G.annual)} a year and ${usd(G.aggregate)} in total. Part-time enrollment and school caps lower them.`,
    };
  },
});
