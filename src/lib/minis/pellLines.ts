/** 2026-27 maximum and minimum Pell Grant AGI lines (2024 poverty guidelines, FSA SAI guide Steps 1 and 3). */
import type { MiniSpec } from '../mini-types';
import { poverty } from '../engine/loans';
import { P, usd, sizes } from './_kit';
const cases = [
  { value: '0', label: 'Dependent, two parents' },
  { value: '1', label: 'Dependent, single parent' },
  { value: '2', label: 'Independent, no children' },
  { value: '3', label: 'Independent single parent' },
  { value: '4', label: 'Independent, married parent' },
];
const areas = [{ value: '0', label: '48 states and DC' }, { value: '1', label: 'Alaska' }, { value: '2', label: 'Hawaii' }];
export default (): MiniSpec => ({
  title: 'Your Pell income lines for 2026-27',
  cta: 'Estimate the award in between',
  ctaHref: '/en/pell-grant-calculator/',
  inputs: [
    { id: 'c', label: 'Situation', def: 0, options: cases },
    { id: 'n', label: 'Family size', def: 4, options: sizes(8) },
    { id: 'a', label: 'State of legal residence', def: 0, options: areas },
  ],
  run: (v) => {
    const area = (['us', 'ak', 'hi'] as const)[v.a] ?? 'us';
    const pov = poverty(v.n, area, '2024');
    const mx = P.pell.maxPellAgiPct; const mn = P.pell.minPellAgiPct;
    const single = v.c === 1 || v.c === 3;
    const maxPct = single ? mx.singleParent : mx.other;
    const minPct = [mn.depOther, mn.depSingleParent, mn.indNoChild, mn.indSingleParent, mn.indParent][v.c] ?? mn.depOther;
    const r = (p: number) => usd(Math.round((pov * p) / 100));
    return {
      head: [`Maximum Pell up to an AGI of (${maxPct}% of poverty)`, r(maxPct)],
      rows: [[`Minimum Pell line (${minPct}%)`, r(minPct)], ['2024 poverty guideline', usd(pov)], ['Award at or under the first line', usd(P.pell.max)]],
      note: 'Above the first line the award depends on the SAI; the minimum award also needs an SAI under twice the maximum Pell.',
    };
  },
});
