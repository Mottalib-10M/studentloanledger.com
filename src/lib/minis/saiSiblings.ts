/** SAI per student when several children are in college: the 2026-27 formula has no number-in-college divisor. */
import type { MiniSpec } from '../mini-types';
import { sai } from '../engine/sai';
import { P, usd } from './_kit';
const kids = [1, 2, 3, 4].map((k) => ({ value: String(k), label: k === 1 ? 'One' : String(k) }));
const household = Array.from({ length: 7 }, (_, i) => ({ value: String(i + 2), label: `${i + 2} people` }));
export default (): MiniSpec => ({
  title: 'One index per student, no matter how many are in college',
  cta: 'Run the full SAI calculator',
  ctaHref: '/en/sai-calculator/',
  inputs: [
    { id: 'agi', label: 'Parents’ adjusted gross income', def: 92000, unit: '$', max: 5000000 },
    { id: 'n', label: 'Household size', def: 5, options: household },
    { id: 'k', label: 'Children in college at the same time', def: 2, options: kids },
  ],
  run: (v) => {
    const r = sai({ dependent: true, married: true, familySize: v.n, filing: 'mfj', parents: { agi: v.agi, taxPaid: Math.round(v.agi * 0.06), earned: v.agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 15000 });
    const k = Math.max(1, Math.min(v.k, v.n - 1));
    return {
      head: ['SAI for each student', r.sai.toLocaleString('en-US')],
      rows: [['Sum of the indexes across the family', (r.sai * k).toLocaleString('en-US')], ['Pell Grant for each student, full time', usd(r.pell)], [`Pell for all ${k}`, usd(r.pell * k)]],
      note: `Assumes married parents, tax paid of 6% of AGI and ${usd(15000)} of savings (${P.sai.parentAssetRate}% counted).`,
    };
  },
});
