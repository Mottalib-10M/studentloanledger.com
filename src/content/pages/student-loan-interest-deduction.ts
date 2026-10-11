import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, interestDeduction, monthInterest } from '../../lib/kit';

const D = P.deduction;
const mid = interestDeduction(2500, (D.single[0] + D.single[1]) / 2, 'single');
const ex = interestDeduction(1800, 72000, 'single');
const joint = interestDeduction(2500, 190000, 'mfj');
const yearInterest = (b: number, r: number) => monthInterest(b, r) * 12;

export default definePage({
  id: 'student-loan-interest-deduction',
  group: 'tax',
  kind: 'pillar',
  order: 10,
  slug: 'student-loan-interest-deduction',
  nav: 'Interest deduction',
  card: 'The 2026 deduction of up to $2,500, its phase-out and the tax it saves',
  title: 'Student Loan Interest Deduction 2026: Limits and Phase-Out',
  description: `Student loan interest deduction 2026: up to ${usd(D.max)}, reduced between ${usd(D.single[0])} and ${usd(D.single[1])} of MAGI (${usd(D.joint[0])} to ${usd(D.joint[1])} joint); see your deduction and tax saved.`,
  h1: 'Student loan interest deduction for 2026',
  intro: 'How much of the interest you pay on student loans in 2026 comes off your taxable income, and what that saves.',
  resume: `For tax year 2026 you can deduct up to ${usd(D.max)} of interest paid on qualified student loans, and the deduction starts shrinking once modified adjusted gross income passes ${usd(D.single[0])} for a single filer or ${usd(D.joint[0])} on a joint return; it disappears at ${usd(D.single[1])} and ${usd(D.joint[1])}. Those thresholds come from IRS Revenue Procedure 2025-32, which adjusts them for inflation each year; the ${usd(D.max)} ceiling is fixed by section 221 of the tax code and has not moved. A single borrower with ${usd(72000)} of income who paid ${usd(1800)} of interest deducts all of it, which in the 22% bracket lowers federal tax by about ${usd(ex.deduction * 0.22)}. The deduction is taken above the line, on Schedule 1, so you get it with the standard deduction and do not need to itemize. Married couples filing separately cannot claim it at all. Your servicer reports the interest you paid on Form 1098-E. This calculator applies the 2026 phase-out to your figures and estimates the tax saved at your bracket.`,
  tool: 'deduction',
  faqs: [
    { q: 'Can I deduct student loan interest if I take the standard deduction?', a: `Yes. The student loan interest deduction is an adjustment to income, claimed on Schedule 1 of Form 1040, so it reduces adjusted gross income whether or not you itemize. That also makes it lower the AGI used by income-driven plans the following year, a small extra benefit for borrowers on RAP or IBR.` },
    { q: 'What is the student loan interest deduction phase-out for 2026?', a: `For tax year 2026, the ${usd(D.max)} limit is reduced proportionally for modified AGI between ${usd(D.single[0])} and ${usd(D.single[1])} for single, head of household and qualifying surviving spouse filers, and between ${usd(D.joint[0])} and ${usd(D.joint[1])} for married couples filing jointly. At the midpoint of the single range, a ${usd(2500)} interest bill gives a ${usd(mid.deduction)} deduction.` },
    { q: 'Can I claim the deduction if I am married filing separately?', a: 'No. Section 221 denies the deduction on a married filing separately return, whatever the income. Couples who file separately to lower an income-driven payment should count this loss, along with others, when they compare the payment saving with the extra tax over a full year.' },
    { q: 'Can my parents deduct interest on my student loans?', a: 'Only if they are legally obligated on the loan, as with a parent PLUS loan or a loan they cosigned, and they paid the interest. A student who is claimed as a dependent on someone else’s return cannot take the deduction. If you pay interest on a loan in your own name and no one claims you, you can.' },
    { q: 'Does interest paid by my employer count?', a: `No double benefit: interest your employer pays under a tax-free educational assistance program, up to ${usd(P.employer127.max)} a year under section 127, cannot also be deducted by you. Interest you pay yourself remains deductible within the limits. The employer program is usually worth more, since it excludes principal too.` },
    { q: 'Which loans qualify for the deduction?', a: 'Loans taken only to pay qualified higher education expenses for you, your spouse or a dependent, while enrolled at least half time in a degree or credential program at an eligible school. Federal and private student loans both qualify; loans from a relative or an employer plan, and revolving credit, do not. Your 1098-E covers the federal ones.' },
    { q: 'Is the deduction worth claiming on a small amount of interest?', a: 'Always, if you qualify: it costs nothing but a line on Schedule 1. Servicers send Form 1098-E when you paid at least $600 of interest, but interest below that is deductible too; you can find the figure in your account. The tax saved equals the deduction times your top bracket.' },
  ],
  body: (h) => `
<h2>The deduction at different incomes</h2>
<p>The table applies the 2026 rules to a borrower who paid ${usd(D.max)} or more of interest. Below the phase-out the full amount comes off income; inside it, the deduction falls in a straight line; above it, nothing is left.</p>
${h.table(['Modified AGI', 'Single filer', 'Married filing jointly'], [60000, D.single[0], 92500, D.single[1], D.joint[0], 190000, D.joint[1]].map((m) => [usd(m), usd(interestDeduction(2500, m, 'single').deduction), usd(interestDeduction(2500, m, 'mfj').deduction)]), 'Deduction for tax year 2026 with at least $2,500 of interest paid.', ['l', 'r', 'r'])}
<h2>How the reduction is computed</h2>
<p>The IRS rule is proportional. Take the share of the phase-out range your modified AGI has crossed, multiply it by your deductible interest (capped at ${usd(D.max)}), and subtract. A couple filing jointly with ${usd(190000)} of modified AGI is halfway through the ${usd(D.joint[0])} to ${usd(D.joint[1])} range, so a ${usd(2500)} interest bill leaves a deduction of ${usd(joint.deduction)}. Modified AGI here means adjusted gross income before this deduction, with certain excluded foreign income added back (${h.src('irc221', '26 U.S.C. 221(b)')}).</p>
<h2>Who reaches the ${usd(D.max)} cap</h2>
<p>Interest falls as a balance is repaid, so the cap matters most in the early years of large loans. At the 2026-27 rates, a first year of repayment on ${usd(30000)} of undergraduate loans at ${pct(R.undergrad)} carries roughly ${usd(yearInterest(30000, R.undergrad))} of interest, already near the cap, and ${usd(80000)} of graduate loans at ${pct(R.grad)} carry about ${usd(yearInterest(80000, R.grad))}, far above it. Borrowers on the Repayment Assistance Plan should note a quirk: interest that RAP waives was never paid, so it is not deductible; only the interest part of your actual payments counts, as reported on the 1098-E.</p>
<h2>What changed for 2026, and what did not</h2>
<p>The 2025 law did not change section 221: the ${usd(D.max)} ceiling is written into the statute and is not indexed for inflation. The phase-out range moves each year with inflation; Revenue Procedure 2025-32 set the 2026 figures (${h.src('irsRp2532', 'IRS Rev. Proc. 2025-32, section 4.29')}). Two neighboring rules did change. Employer payments of student loans under section 127 became permanent, up to ${usd(P.employer127.max)} a year and indexed from ${P.employer127.indexedFrom}, and the exclusion of forgiven debt was narrowed to death and disability discharges. ${h.a('employer-student-loan-repayment', 'Employer student loan repayment')} and ${h.a('forgiveness-taxes', 'taxes on forgiveness')} cover those.</p>
<h2>Filing tips</h2>
<p>Add up the interest from every 1098-E if you have several servicers, and add interest paid to a private lender, which sends its own form. Interest paid by someone else on your behalf, such as a parent paying your loan, is treated as paid by you if you are the borrower and not claimed as a dependent. Keep the forms with your return. If a deduction lowers your AGI below a RAP bracket line, your loan payment can fall the next year too: the ${h.a('rap-calculator', 'RAP calculator')} shows the bracket edges.</p>`,
  related: ['employer-student-loan-repayment', 'student-loan-interest-calculator', 'forgiveness-taxes', 'married-borrowers', 'rap-calculator', '529-calculator'],
  sources: ['irsRp2532', 'irc221', 'obbba', 'irc127'],
});
