/** Length test of a Workforce Pell program (HEA 481(b)(3)(A)(i) as added by Public Law 119-21 sec. 83002). */
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Does the program fit the Workforce Pell length rule?',
  cta: 'See what a regular Pell Grant would pay',
  ctaHref: '/en/pell-grant-calculator/',
  inputs: [
    { id: 'h', label: 'Clock hours of instruction', def: 320, max: 5000 },
    { id: 'w', label: 'Length in weeks', def: 10, max: 200 },
  ],
  run: (v) => {
    const hoursOk = v.h >= 150 && v.h < 600;
    const weeksOk = v.w >= 8 && v.w < 15;
    const ok = hoursOk && weeksOk;
    const hoursMsg = hoursOk ? 'Inside 150 to 599' : v.h < 150 ? `${150 - v.h} hours short` : 'Too long for Workforce Pell';
    const weeksMsg = weeksOk ? 'Inside 8 to 14' : v.w < 8 ? `${8 - v.w} weeks short` : 'Too long for Workforce Pell';
    return {
      head: ['Length test', ok ? 'Passes' : 'Fails'],
      rows: [['Clock hours', hoursMsg], ['Weeks', weeksMsg], ['Still required', ok ? 'Governor approval, then the Department' : 'Not a Workforce Pell program']],
      note: 'Credit-hour programs use an equivalent number of credit hours. Length is only the first of the tests.',
    };
  },
});
