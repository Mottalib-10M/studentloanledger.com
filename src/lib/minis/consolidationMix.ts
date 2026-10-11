/** Two loans combined: weighted average rate and the Tiered Standard term of the total. */
import type { MiniSpec } from '../mini-types';
import { tieredStandard } from '../engine/loans';
import { usd } from './_kit';
export default (): MiniSpec => ({
  title: 'Two loans into one: rate and term',
  cta: 'Compare RAP and Tiered Standard on the total',
  ctaHref: '/en/',
  inputs: [
    { id: 'a', label: 'Loan A balance', def: 18000, unit: '$', max: 2000000 },
    { id: 'ra', label: 'Loan A rate', def: 6.53, unit: '%', max: 20, decimals: 2 },
    { id: 'b', label: 'Loan B balance', def: 22000, unit: '$', max: 2000000 },
    { id: 'rb', label: 'Loan B rate', def: 8.08, unit: '%', max: 20, decimals: 2 },
  ],
  run: (v) => {
    const total = v.a + v.b; const w = total > 0 ? (v.a * v.ra + v.b * v.rb) / total : 0;
    const t = tieredStandard(total, w);
    return { head: ['Weighted average rate', `${w.toFixed(3)}%`], rows: [['Combined balance', usd(total)], [`Tiered Standard, ${t.years} years`, usd(t.payment)], ['Plans open to the new loan', 'RAP or Tiered Standard']], note: 'Before the rounding the Department applies to the consolidation rate.' };
  },
});
