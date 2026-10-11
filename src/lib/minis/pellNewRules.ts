/** The 2026-27 Pell blocks added by Public Law 119-21 (secs. 83001(b) and 83004) applied to one student. */
import type { MiniSpec } from '../mini-types';
import { P, usd } from './_kit';
export default (): MiniSpec => ({
  title: 'Do the new Pell rules cut you off?',
  cta: 'Estimate your SAI first',
  ctaHref: '/en/sai-calculator/',
  inputs: [
    { id: 's', label: 'Student Aid Index', def: 15200, max: 999999 },
    { id: 'g', label: 'State, school and private grants for the year', def: 9000, unit: '$', max: 1000000 },
    { id: 'c', label: 'Cost of attendance for the year', def: 31000, unit: '$', max: 1000000 },
  ],
  run: (v) => {
    const max = P.pell.max; const min = (max * P.pell.minPct) / 100; const cap = max * P.pell.highSaiMultiple;
    const highSai = v.s >= cap; const covered = v.c > 0 && v.g >= v.c;
    let award = 'Minimum possible if income is under the minimum line';
    if (v.s <= 0) award = usd(max); else if (v.s <= max - min) award = usd(max - v.s);
    const blocked = highSai || covered;
    return {
      head: ['Pell Grant under the 2026-27 rules', blocked ? usd(0) : award],
      rows: [[`SAI test (cut-off ${cap.toLocaleString('en-US')})`, highSai ? 'Fails' : 'Passes'], ['Grants against cost of attendance', covered ? 'Grants cover it: fails' : `Short by ${usd(Math.max(0, v.c - v.g))}`], ['Scheduled award before the new rules', award]],
    };
  },
});
