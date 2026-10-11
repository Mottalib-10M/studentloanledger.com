/** Net price = cost of attendance minus grants, with a Pell estimate from the SAI (20 U.S.C. 1070a; Public Law 119-21 secs. 83001, 83004). */
import type { MiniSpec } from '../mini-types';
import { P, usd } from './_kit';
const pellMin = (P.pell.max * P.pell.minPct) / 100;
export default (): MiniSpec => ({
  title: 'Net price in three numbers',
  cta: 'Estimate your Student Aid Index',
  ctaHref: '/en/sai-calculator/',
  inputs: [
    { id: 'coa', label: 'Cost of attendance for the year', def: 34000, unit: '$', max: 200000 },
    { id: 'gr', label: 'Grants and scholarships, not counting Pell', def: 9000, unit: '$', max: 200000 },
    { id: 'sai', label: 'Student Aid Index (SAI)', def: 2500, max: 999999 },
  ],
  run: (v) => {
    let pell = v.sai <= 0 ? P.pell.max : v.sai <= P.pell.max - pellMin ? P.pell.max - v.sai : 0;
    if (v.sai >= P.pell.max * P.pell.highSaiMultiple || v.gr >= v.coa) pell = 0;
    pell = Math.min(pell, Math.max(0, v.coa - v.gr));
    const net = Math.max(0, v.coa - v.gr - pell);
    return {
      head: ['Net price for the year', usd(net)],
      rows: [
        ['Pell Grant estimate', usd(pell)],
        ['All grants together', usd(v.gr + pell)],
        ['Share of the cost covered by grants', v.coa > 0 ? `${Math.round(((v.gr + pell) / v.coa) * 100)}%` : '0%'],
      ],
      note: `Pell estimate: ${usd(P.pell.max)} minus the SAI, full-time. Low-income families can also qualify for the minimum award through the income lines, not modeled here.`,
    };
  },
});
