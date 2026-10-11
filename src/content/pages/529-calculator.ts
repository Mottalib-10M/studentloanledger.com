import { definePage } from '../../lib/page-types';
import { P, usd, futureValue } from '../../lib/kit';

const S = P.s529;
const base = futureValue(5000, 250, 12, 5);
const row = (m: number) => [usd(m), usd(futureValue(0, m, 18, 4)), usd(futureValue(0, m, 18, 6)), usd(futureValue(0, m, 10, 5))];

export default definePage({
  id: '529-calculator',
  group: 'tax',
  kind: 'pillar',
  order: 20,
  slug: '529-plan-calculator',
  nav: '529 calculator',
  card: 'What a 529 plan could grow to, and the 2026 rules on K-12 tuition and credentials',
  title: '529 Calculator 2026: Projected Balance and the New Rules',
  description: `529 calculator 2026: project your savings at a return you choose; K-12 tuition now up to ${usd(S.k12New)} a year, credentials qualify, ${usd(S.giftExclusion)} gift tax exclusion.`,
  h1: '529 plan calculator',
  intro: 'What regular contributions to a 529 account could become, under a return you choose, and what the 2025 law added to qualified expenses.',
  resume: `A 529 account holding ${usd(5000)} today, fed ${usd(250)} a month for twelve years, would reach about ${usd(base)} if it earned 5% a year, of which ${usd(5000 + 250 * 144)} would be your own contributions. That return is an assumption you choose, not a forecast: 529 plans invest in markets and can lose value. What the law guarantees is the tax treatment. Earnings grow without federal income tax and come out tax-free when they pay qualified education expenses. The 2025 budget law widened what counts. From tax year 2026, up to ${usd(S.k12New)} a year can be withdrawn for elementary and secondary school tuition, twice the former ${usd(S.k12Old)}, and a list of K-12 costs such as books, online materials, tutoring and test fees became qualified. Programs leading to recognized postsecondary credentials, including state licenses, industry certifications and registered apprenticeships, also qualify. Contributions of up to ${usd(S.giftExclusion)} per donor and beneficiary in 2026 stay within the annual gift tax exclusion.`,
  tool: 's529',
  faqs: [
    { q: 'How much will my 529 be worth when my child starts college?', a: `It depends on contributions, time and returns. ${usd(250)} a month for eighteen years grows to about ${usd(futureValue(0, 250, 18, 5))} at an assumed 5% a year and ${usd(futureValue(0, 250, 18, 3))} at 3%. Enter your own figures above. Plans that shift to bonds as the child nears college typically earn less in the last years.` },
    { q: 'Can I use a 529 for private elementary or high school tuition in 2026?', a: `Yes, up to ${usd(S.k12New)} per year per beneficiary for tax years beginning after December 31, 2025, up from ${usd(S.k12Old)}. The 2025 law also made curriculum materials, books, online educational materials, outside tutoring by qualified instructors, standardized test fees, dual enrollment fees and educational therapies for students with disabilities qualified K-12 expenses.` },
    { q: 'Do trade certifications and licenses count as 529 expenses now?', a: 'Yes, for distributions after July 4, 2025. Tuition, fees, books and equipment for a recognized postsecondary credential program qualify, as do required testing fees and continuing education needed to keep the credential. Recognized credentials include state or federal occupational licenses, registered apprenticeship certificates and certain industry certifications.' },
    { q: 'How much can I put into a 529 without gift tax?', a: `${usd(S.giftExclusion)} per donor per beneficiary in 2026 stays within the annual gift tax exclusion set by the IRS, so two parents can give ${usd(S.giftExclusion * 2)} to one child. Larger gifts are possible; they use part of the lifetime exemption or require a gift tax return. 529 plans themselves set much higher account limits.` },
    { q: 'Does a 529 hurt financial aid?', a: 'Somewhat. A parent-owned 529 is a parent asset in the 2026-27 Student Aid Index: 12% of parents’ net worth, with no asset protection allowance this year, is added to available income before the assessment schedule of 22% to 47% applies. A dependent student’s own savings count at 20%, directly. The effect on the SAI is usually small next to income.' },
    { q: 'What happens if my child does not go to college?', a: 'You can change the beneficiary to another family member without tax, keep the money for later education, or use it for K-12 or credential expenses now that they qualify. A non-qualified withdrawal makes the earnings taxable and subject to an additional tax; contributions themselves come back tax-free.' },
  ],
  body: (h) => `
<h2>Monthly contributions and what they could become</h2>
<p>The table runs the same projection as the calculator for a few monthly amounts. Two return assumptions are shown for an account opened at birth, to make the uncertainty visible, and one for a ten-year horizon.</p>
${h.table(['Monthly contribution', '18 years at 4%', '18 years at 6%', '10 years at 5%'], [100, 250, 500, 1000].map(row), 'Projection only. Returns are assumptions, not forecasts, and do not include plan fees.', ['l', 'r', 'r', 'r'])}
<h2>What the 2025 law changed</h2>
<p>Section 70413 of Public Law 119-21 rewrote the K-12 rule. Before, only tuition at an elementary or secondary school counted, up to ${usd(S.k12Old)} a year. Now the limit is ${usd(S.k12New)} for taxable years beginning after December 31, 2025, and qualified K-12 expenses include curriculum and curricular materials, books, online educational materials, tutoring outside the home by a licensed teacher or a subject matter expert who is not a relative, fees for standardized and admission tests and AP exams, dual enrollment fees, and educational therapies for students with disabilities. Section 70414 added recognized postsecondary credential programs (${h.src('obbba', 'Public Law 119-21, sections 70413 and 70414')}).</p>
<h2>Using the projection for a college budget</h2>
<p>A projected balance becomes useful when set against a cost. The ${h.a('college-savings-calculator', 'college savings calculator')} works backward from a yearly net price to the monthly saving needed, and the ${h.a('net-price-calculator', 'net price page')} explains how to get that number. Savings reduce the need to borrow, and federal borrowing is now capped more tightly than before: parent PLUS loans are limited to ${usd(P.limits.parentPlus.annual)} a year and ${usd(P.limits.parentPlus.aggregate)} per student from July 1, 2026, as the ${h.a('parent-plus-loan-calculator', 'parent PLUS calculator')} shows.</p>
<h2>Choosing a return assumption</h2>
<p>The calculator does not suggest a rate because no honest one exists. Plans offer portfolios from cash-like options to all-stock funds, and age-based portfolios shift toward bonds as the beneficiary nears college, which usually lowers returns in the last years and reduces the risk of a loss just before tuition is due. A sensible way to use the tool is to run three cases, for example 2%, 4% and 6%, and plan on the low one. Plan fees reduce the return you actually receive; subtract them from your assumption. Contributions you make are certain; growth is not, and the gap between the two lines in the result is the part that depends on markets.</p>
<h2>Taxes on the way out</h2>
<p>Withdrawals are tax-free up to the qualified expenses of the year, and the expense and the withdrawal should fall in the same calendar year. A withdrawal above qualified expenses is partly taxable: the earnings share of it is added to income and generally carries an additional 10% tax under section 529 and section 530. Expenses paid with tax-free grants or used to claim an education credit cannot be counted again for a tax-free withdrawal. Rules: ${h.src('irc529', '26 U.S.C. 529')}.</p>`,
  related: ['college-savings-calculator', 'net-price-calculator', 'parent-plus-loan-calculator', 'sai-calculator', 'student-loan-interest-deduction', 'how-much-student-loan'],
  sources: ['obbba', 'irc529', 'irsRp2532', 'saiGuide'],
});
