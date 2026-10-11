/** Quick 2026-27 SAI from the parents' 2024 AGI, household size and savings (Formula A, lib/engine/sai.ts). */
import type { MiniSpec } from '../mini-types';
import { sai } from '../engine/sai';
import { poverty } from '../engine/loans';
import { P, usd } from './_kit';
const household = Array.from({ length: 7 }, (_, i) => ({ value: String(i + 2), label: `${i + 2} people` }));
export default (): MiniSpec => ({
  title: 'A first FAFSA estimate from three figures',
  cta: 'Add tax paid and student income in the SAI calculator',
  ctaHref: '/en/sai-calculator/',
  inputs: [
    { id: 'agi', label: 'Parents’ adjusted gross income', def: 68000, unit: '$', max: 5000000 },
    { id: 'n', label: 'Household size', def: 4, options: household },
    { id: 'sav', label: 'Parents’ savings and investments', def: 9000, unit: '$', max: 10000000 },
  ],
  run: (v) => {
    const r = sai({ dependent: true, married: true, familySize: v.n, filing: 'mfj', parents: { agi: v.agi, taxPaid: 0, earned: v.agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: v.sav });
    const line = Math.round((poverty(v.n, 'us', '2024') * P.pell.maxPellAgiPct.other) / 100);
    return {
      head: ['Estimated Student Aid Index', r.sai.toLocaleString('en-US')],
      rows: [['Pell Grant, full time', usd(r.pell)], ['Counted from savings', usd(Math.round((v.sav * P.sai.parentAssetRate) / 100))], ['AGI line for the maximum award', usd(line)]],
      note: 'Married parents, all income from work, federal income tax paid left at zero, so the index leans high.',
    };
  },
});
