/** How far below zero a 2026-27 SAI falls, before and after the -1,500 floor (FSA SAI guide, Formula A). */
import type { MiniSpec } from '../mini-types';
import { sai } from '../engine/sai';
import { P, usd, yesNo } from './_kit';
const household = Array.from({ length: 7 }, (_, i) => ({ value: String(i + 2), label: `${i + 2} people` }));
export default (): MiniSpec => ({
  title: 'How negative is your SAI?',
  cta: 'See the full worksheet in the SAI calculator',
  ctaHref: '/en/sai-calculator/',
  inputs: [
    { id: 'agi', label: 'Parents’ adjusted gross income', def: 50000, unit: '$', max: 5000000 },
    { id: 'n', label: 'Household size', def: 4, options: household },
    { id: 'nf', label: 'Parents did not file a tax return', def: 0, options: yesNo },
  ],
  run: (v) => {
    const r = sai({ dependent: true, married: true, familySize: v.n, filing: 'mfj', nonFiler: v.nf === 1, parents: { agi: v.agi, taxPaid: Math.round(v.agi * 0.02), earned: v.agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 4000 });
    const raw = r.parts.length >= 7 ? r.parts[4][1] + r.parts[5][1] + r.parts[6][1] : r.sai;
    return {
      head: ['Student Aid Index', r.sai.toLocaleString('en-US')],
      rows: [['Formula result before the floor', v.nf === 1 ? 'Not computed' : raw.toLocaleString('en-US')], ['Distance from the floor', (r.sai - P.sai.floor).toLocaleString('en-US')], ['Pell Grant, full time', usd(r.pell)]],
      note: `Married parents, tax paid of 2% of AGI, ${usd(4000)} of savings, no student income. The floor is ${P.sai.floor.toLocaleString('en-US')}.`,
    };
  },
});
