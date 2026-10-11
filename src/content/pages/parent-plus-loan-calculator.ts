import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, tieredStandard, standard10, monthInterest } from '../../lib/kit';

const L = P.limits.parentPlus;
const four = Math.min(L.annual * 4, L.aggregate);
const t4 = tieredStandard(four, R.plus);
const t1 = tieredStandard(L.annual, R.plus);
const sib = tieredStandard(L.aggregate * 2, R.plus);

export default definePage({
  id: 'parent-plus-loan-calculator',
  group: 'borrow',
  kind: 'pillar',
  order: 20,
  slug: 'parent-plus-loan-calculator',
  nav: 'Parent PLUS calculator',
  card: 'What parents can borrow under the 2026 caps and what it costs each month',
  title: 'Parent PLUS Loan Calculator 2026: New Caps and Payments',
  description: `Parent PLUS loan calculator 2026: ${usd(L.annual)} a year and ${usd(L.aggregate)} per student under the new caps, ${pct(R.plus)} interest, and the Tiered Standard payment parents now owe.`,
  h1: 'Parent PLUS loan calculator',
  intro: 'How much parents can still borrow for a dependent undergraduate after July 1, 2026, and what repayment will look like.',
  resume: `Parents who borrow the new maximum of ${usd(L.annual)} a year in parent PLUS loans for four years reach ${usd(four)}, just under the ${usd(L.aggregate)} cap per student, and owe about ${usd(t4.payment)} a month over ${t4.years} years at the 2026-27 rate of ${pct(R.plus)}. Before ${day(P.law.newPlansStart)} there was no fixed ceiling: parents could borrow up to the cost of attendance minus other aid. The 2025 law replaced that with an annual limit of ${usd(L.annual)} for all parents of one dependent student together, an aggregate limit of ${usd(L.aggregate)} that counts every dollar ever borrowed for that student, even if repaid, and one repayment path for new loans: the Tiered Standard plan, with its term set by the balance. The Repayment Assistance Plan is not open to parent PLUS loans, and neither is IBR unless an older loan goes through a consolidation route that closes in 2028. This calculator shows how much of your plan fits under the caps and what the monthly bill becomes.`,
  tool: 'parentplus',
  faqs: [
    { q: 'How much can parents borrow in parent PLUS loans per year in 2026-27?', a: `${usd(L.annual)} per dependent student per year, combined for all parents, for periods of enrollment beginning on or after ${day(P.law.newPlansStart)}. It is also limited by cost of attendance minus other aid, and a school may set a lower limit for a program. Two parents cannot each borrow ${usd(L.annual)} for the same child.` },
    { q: 'Does the $65,000 parent PLUS cap reset if we repay the loans?', a: `No. The ${usd(L.aggregate)} aggregate counts every parent PLUS dollar borrowed for that student, without regard to amounts repaid, forgiven or discharged. Only funds the school returns or that you send back count as never borrowed. Each child has a separate cap, so a family with two children can borrow up to ${usd(L.aggregate * 2)}.` },
    { q: 'What is the interest rate on a parent PLUS loan for 2026-27?', a: `${pct(R.plus)} fixed for loans first disbursed from ${day(R.from)} to ${day(R.to)}: the ${pct(P.rates.treasury)} Treasury yield of May 12, 2026 plus the ${pct(P.rates.addOn.plus)} add-on, under the ${pct(P.rates.cap.plus)} cap. Interest accrues from disbursement, including while the student is in school if the parent defers payments.` },
    { q: 'Can a parent PLUS loan be repaid on an income-driven plan?', a: `A parent PLUS loan made on or after ${day(P.law.newPlansStart)} cannot: it goes on the Tiered Standard plan. Older parent PLUS loans can reach ICR, and later IBR, only after consolidation, and the window for that route ends on ${day(P.law.oldPlansLastDay)}. The parent PLUS repayment page explains the steps.` },
    { q: 'What if our family started college before July 2026?', a: `If the student was enrolled on June 30, 2026 and a Direct Loan had already been made for the program to the parent or the student, the new caps do not apply for the expected time to finish, at most ${P.limits.legacyYearsMax} academic years. Parent PLUS can still go up to cost of attendance minus aid during that period.` },
    { q: 'Can the student take over a parent PLUS loan?', a: 'No federal program transfers a parent PLUS loan to the student. The parent remains the borrower. The student can make payments on it informally, or refinance it into their own name with a private lender, which ends every federal protection, including discharge if the student dies, which parent PLUS loans provide.' },
  ],
  body: (h) => `
<h2>Payments for typical borrowing plans</h2>
${h.table(['Parent PLUS borrowed', 'Tiered Standard term', 'Monthly payment', 'On a 10-year schedule'], [L.annual, 40000, four, L.aggregate].map((b) => { const t = tieredStandard(b, R.plus); return [usd(b), `${t.years} years`, usd(t.payment), usd(standard10(b, R.plus))]; }), `At ${pct(R.plus)}. Interest accrued before repayment begins is not included.`, ['l', 'r', 'r', 'r'])}
<h2>Interest before the first payment</h2>
<p>Repayment of a parent PLUS loan normally begins once the loan is fully disbursed, but parents may ask to defer payments while the student is enrolled at least half time and for six months after. Interest runs either way. A single year's ${usd(L.annual)} loan accrues about ${usd(monthInterest(L.annual, R.plus))} of interest a month at ${pct(R.plus)}, so four years of deferral on the first-year loan alone add several thousand dollars to the balance that then sets the Tiered Standard term. Paying the interest as it accrues keeps the term, and the total cost, down.</p>
<h2>The gap the caps leave</h2>
<p>For families at expensive colleges, ${usd(L.annual)} a year will not close the distance between aid and cost. The options left are the student's own Direct Loans, ${usd(P.limits.depUndergrad.total[0])} in the first year for a dependent student, or ${usd(P.limits.indUndergrad.total[0])} if the parent is denied a PLUS loan; savings, including 529 plans; institutional aid; and private loans, which do not carry federal protections. The Department's July 2026 fact sheet presents the caps as a way to push colleges to lower costs (${h.src('edJuly1', 'Department of Education, July 1, 2026')}). The ${h.a('net-price-calculator', 'net price page')} helps measure the gap before committing.</p>
<h2>Two children, one household</h2>
<p>The cap is per student, so parents of two can borrow up to ${usd(L.aggregate * 2)} over time. Combined, that balance would fall in the ${sib.years}-year tier with a payment of about ${usd(sib.payment)}. Because the Tiered Standard term depends on the total principal of all your Direct Loans when you enter repayment, borrowing for a second child can move you into a longer tier and lower the monthly payment, at the cost of more interest overall. A parent close to retirement should weigh that horizon carefully.</p>
<h2>Credit check and the endorser route</h2>
<p>Parent PLUS is the only Direct Loan with a credit check: a parent with an adverse credit history can be denied, can apply with an endorser, or can document extenuating circumstances. A denial has a useful side effect for the student, who then becomes eligible for the higher unsubsidized amounts of an independent undergraduate, ${usd(P.limits.indUndergrad.total[0])} instead of ${usd(P.limits.depUndergrad.total[0])} in the first year. The regulation is explicit that a parent's refusal to borrow does not trigger that extra eligibility; only a parent's inability does.</p>
<h2>Repaying a parent PLUS loan</h2>
<p>New parent PLUS loans are excepted loans: they must be repaid on the Tiered Standard plan, separately from any loans the parent took for their own education (${h.src('obbba', 'HEA section 455(d)(7)(E)')}). Prepaying is allowed at any time without penalty. For older loans and the consolidation route to an income-driven plan, read ${h.a('parent-plus-repayment', 'parent PLUS repayment options')}.</p>`,
  related: ['parent-plus-repayment', 'how-much-student-loan', 'interest-rates', 'tiered-standard-repayment-plan', 'net-price-calculator', '529-calculator'],
  sources: ['obbba', 'ecfr203', 'ratesNotice', 'riseFinal', 'edJuly1'],
});
