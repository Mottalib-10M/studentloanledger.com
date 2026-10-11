/** Possible federal tax on forgiven student debt at a bracket the user chooses (PSLF and death/disability excluded). */
import type { MiniSpec } from '../mini-types';
import { usd } from './_kit';
const BR = [10, 12, 22, 24, 32, 35, 37].map((x) => ({ value: String(x), label: `${x}%` }));
export default (): MiniSpec => ({
  title: 'Possible federal tax on forgiven loans',
  cta: 'Estimate how much could be forgiven',
  ctaHref: '/en/student-loan-forgiveness/',
  inputs: [
    { id: 'f', label: 'Amount forgiven on RAP or IBR', def: 60000, unit: '$', max: 5000000 },
    { id: 'b', label: 'Top federal bracket it would fall in', def: 22, options: BR },
  ],
  run: (v) => ({ head: ['Rough federal tax if fully taxable', usd((v.f * v.b) / 100)], rows: [['PSLF forgiveness', 'not taxed'], ['Death or disability discharge', 'not taxed'], ['Saving needed per year over 20 years', usd((v.f * v.b) / 100 / 20)]], note: 'Large amounts can span several brackets; insolvency can exclude part. Not tax advice.' }),
});
