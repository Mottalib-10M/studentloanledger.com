/** Expected time to credential for the July 2026 transition exception (HEA 455(a)(8); 34 CFR 685.102, 685.203). */
import type { MiniSpec } from '../mini-types';
import { P, num, yesNo } from './_kit';
const yrs = (n: number) => `${num(n, n % 1 ? 1 : 0)} academic year${n === 1 ? '' : 's'}`;
export default (): MiniSpec => ({
  title: 'Your expected time to credential',
  cta: 'Check the limits that apply after it',
  ctaHref: '/en/how-much-student-loan-can-i-get/',
  inputs: [
    { id: 'len', label: 'Published program length (academic years)', def: 4, decimals: 1, max: 10 },
    { id: 'done', label: 'Already completed (academic years)', def: 1, decimals: 1, max: 10 },
    { id: 'ok', label: 'In the program on June 30 with a Direct Loan for it', def: 1, options: yesNo },
  ],
  run: (v) => {
    const left = Math.max(0, v.len - v.done);
    const etc = v.ok ? Math.min(P.limits.legacyYearsMax, left) : 0;
    const after = Math.max(0, left - etc);
    return {
      head: ['Old limits, including Grad PLUS, for', yrs(etc)],
      rows: [
        ['Program time remaining', yrs(left)],
        ['Time left under the new caps', yrs(after)],
        ['Status', v.ok ? (after > 0 ? 'Exception ends before you finish' : 'Covered to the end of the program') : 'No exception: new limits apply now'],
      ],
      note: 'Lesser of three academic years or published length minus time completed. Withdrawing ends the exception.',
    };
  },
});
