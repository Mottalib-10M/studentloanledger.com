import { definePage } from '../../lib/page-types';
import { P, usd, futureValue } from '../../lib/kit';

const need = (cost: number, years: number, n: number, infl: number, ret: number, saved: number) => {
  let goal = 0; for (let k = 0; k < n; k++) goal += cost * Math.pow(1 + infl / 100, years + k);
  const gap = Math.max(0, goal - futureValue(saved, 0, years, ret));
  return { goal, monthly: gap / futureValue(0, 1, years, ret) };
};
const ex = need(30000, 10, 4, 3, 5, 10000);
const early = need(30000, 16, 4, 3, 5, 0);
const late = need(30000, 5, 4, 3, 5, 0);

export default definePage({
  id: 'college-savings-calculator',
  group: 'tax',
  kind: 'pillar',
  order: 30,
  slug: 'college-savings-calculator',
  nav: 'College savings calculator',
  card: 'The monthly saving needed to cover a future net price, year by year',
  title: 'College Savings Calculator 2026: Monthly Amount to Save',
  description: `College savings calculator 2026: monthly saving needed for a future net price; ${usd(30000)} a year in ten years needs about ${usd(ex.monthly)} a month with ${usd(10000)} saved, at 5%.`,
  h1: 'College savings calculator',
  intro: 'Work backward from the yearly net price of college to the amount to put aside each month, with your own cost and return assumptions.',
  resume: `To cover four years at a net price of ${usd(30000)} a year in today's dollars, starting in ten years, a family that has ${usd(10000)} saved would need to set aside about ${usd(ex.monthly)} a month, assuming costs rise 3% a year and savings earn 5%. Started at birth, sixteen years out, the same goal would take about ${usd(early.monthly)} a month; started five years before college, about ${usd(late.monthly)}. Time does most of the work, which is why the monthly figure falls so fast with an early start. The calculator adds up the future cost of each year of college separately, since the fourth year is paid later and at a higher price than the first, then subtracts what your current savings may grow to and spreads the gap over the months left. Every rate in it is your assumption. The cost to use is the net price after grants, not the sticker price, and the money saved reduces the need for loans at a time when federal borrowing for parents is capped at ${usd(P.limits.parentPlus.annual)} a year per student.`,
  tool: 'savings',
  faqs: [
    { q: 'How much should I save each month for college?', a: `It depends on the net price, the years left and the return. For ${usd(20000)} a year of net price over four years, starting in fifteen years with nothing saved, the calculator gives about ${usd(need(20000, 15, 4, 3, 5, 0).monthly)} a month at 3% cost growth and a 5% return. Change any input to see your own figure.` },
    { q: 'What yearly cost increase should I assume?', a: 'Use a figure you consider prudent for the kind of college you have in mind, and test a higher one. The calculator does not impose a rate because college prices vary widely between public and private schools and from year to year. A one-point difference in cost growth changes the goal noticeably over fifteen years.' },
    { q: 'Should I use the sticker price or the net price?', a: 'The net price: cost of attendance minus the grants and scholarships the student is likely to receive. That is what the family actually pays from savings, income and loans. Each college publishes a net price calculator; the net price page explains how a Pell Grant and the Student Aid Index fit into it.' },
    { q: 'Where should college savings go?', a: `A 529 plan grows tax-free for qualified expenses, which since 2026 include up to ${usd(P.s529.k12New)} a year of K-12 tuition and recognized credential programs. Other options include a regular brokerage account or savings account, without the tax benefit. The 529 calculator projects an account balance from monthly contributions.` },
    { q: 'What if we cannot save the full amount?', a: `Few families do. Savings combine with the student's own federal loans, ${usd(P.limits.depUndergrad.total[0])} in the first year for a dependent undergraduate, work-study, grants and income during the college years. Saving half the goal still halves the borrowing, and every dollar not borrowed saves interest at ${P.rates.current.undergrad}% or more.` },
    { q: 'Does saving reduce financial aid?', a: 'Parent savings count in the Student Aid Index: 12% of parents’ net worth joins their available income before the assessment, with no asset protection allowance in 2026-27. The effect is modest compared with income, and a family that saves usually ends up borrowing less even after any aid reduction.' },
  ],
  body: (h) => `
<h2>Start date and monthly effort</h2>
<p>The table keeps the same goal, four years at ${usd(30000)} a year in today's money with 3% yearly cost growth and a 5% return, and changes only the number of years before college. The monthly amount needed when nothing is saved yet shows why the first years matter most.</p>
${h.table(['Years before college', 'Future cost of four years', 'Monthly saving needed'], [18, 14, 10, 6, 3].map((y) => { const r = need(30000, y, 4, 3, 5, 0); return [String(y), usd(r.goal), usd(r.monthly)]; }), 'Assumptions: costs +3% a year, savings +5% a year, no savings yet. Not a forecast.', ['l', 'r', 'r'])}
<h2>How the calculation works</h2>
<p>Each college year is priced at today's cost grown by your inflation assumption up to the year it is paid, so a four-year degree that starts in ten years is priced at years ten, eleven, twelve and thirteen. The total is the goal. Current savings are projected forward to the start date at your return assumption and subtracted. The gap is divided by the future value of saving one dollar a month until college starts, which gives the monthly amount. The simplification is that all the money is assumed to be ready on the first day of college; in practice the last years' costs can keep growing in the account while the first years are being paid, so the result errs on the cautious side. Raising the return assumption lowers the monthly figure, and raising cost growth raises it; the two often move together over long periods, so testing both high and both low gives a fair range. Revisit the plan each year with the real balance instead of the projected one.</p>
<h2>Where the net price comes from</h2>
<p>For most families the right input is not the published cost of attendance but what is left after grants. A student who qualifies for a Pell Grant, up to ${usd(P.pell.max)} for 2026-27, faces a much lower net price at the same college than one who does not (${h.src('approps', 'Public Law 119-75')}). The ${h.a('sai-calculator', 'SAI calculator')} estimates the Student Aid Index that drives need-based aid, and the ${h.a('net-price-calculator', 'net price page')} shows how to combine it with a college's own figures.</p>
<h2>Savings and the 2026 borrowing caps</h2>
<p>Saving matters more than it did a few years ago because borrowing is tighter. Parents can no longer borrow up to the cost of attendance through parent PLUS: from July 1, 2026 the limit is ${usd(P.limits.parentPlus.annual)} a year and ${usd(P.limits.parentPlus.aggregate)} in total per student (${h.src('obbba', 'HEA section 455(a)(5)')}). Graduate school is capped too. A family that expects a gap larger than those limits has to fill it with savings, earnings, institutional aid or private credit, and the ${h.a('how-much-student-loan', 'loan limits calculator')} shows exactly what federal loans can still cover.</p>`,
  related: ['529-calculator', 'net-price-calculator', 'sai-calculator', 'parent-plus-loan-calculator', 'how-much-student-loan', 'pell-grant-calculator'],
  sources: ['obbba', 'irc529', 'approps', 'saiGuide'],
});
