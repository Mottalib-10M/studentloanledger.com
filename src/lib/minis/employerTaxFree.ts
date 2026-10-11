/** Federal income tax saved by tax-free employer student loan payments (26 U.S.C. 127, as amended by Public Law 119-21 sec. 70412). */
import type { MiniSpec } from '../mini-types';
import { P, usd } from './_kit';
export default (): MiniSpec => ({
  title: 'What a tax-free employer payment is worth',
  cta: 'See how fast extra payments clear a loan',
  ctaHref: '/en/student-loan-payoff-calculator/',
  inputs: [
    { id: 'pay', label: 'Employer loan payments per year', def: 3600, unit: '$', max: 100000 },
    { id: 'tuition', label: 'Employer tuition help the same year', def: 0, unit: '$', max: 100000 },
    { id: 'br', label: 'Your federal tax bracket', def: 22, options: [10, 12, 22, 24, 32, 35, 37].map((b) => ({ value: String(b), label: `${b}%` })) },
  ],
  run: (v) => {
    const total = Math.max(0, v.pay) + Math.max(0, v.tuition);
    const free = Math.min(total, P.employer127.max);
    const taxable = total - free;
    const saved = (free * v.br) / 100;
    return {
      head: ['Federal income tax you avoid', usd(saved)],
      rows: [
        ['Tax-free under section 127', usd(free)],
        ['Taxable as wages', usd(taxable)],
        ['Same help paid as salary would leave', usd(total - (total * v.br) / 100)],
      ],
      note: `One ${usd(P.employer127.max)} ceiling covers loan payments and tuition help together. Payroll and state taxes are not included.`,
    };
  },
});
