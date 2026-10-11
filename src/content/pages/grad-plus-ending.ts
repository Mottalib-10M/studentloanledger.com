import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, num, rapPayment, ibrPayment, standard10 } from '../../lib/kit';

const L = P.limits; const H = P.rates.history;
const cap = L.legacyYearsMax;
const etc = (len: number, done: number) => Math.min(cap, Math.max(0, len - done));
const cases: Array<[string, number, number]> = [
  ['Two-year master’s, first year done', 2, 1],
  ['Four-year M.D. or D.D.S., first year done', 4, 1],
  ['Five-year doctorate, first year done', 5, 1],
  ['Six-year doctorate, just started', 6, 0],
];
const yrs = (n: number) => `${num(n, n % 1 ? 1 : 0)} year${n === 1 ? '' : 's'}`;
const oldPlus = 30000;
const plusGap = (oldPlus * (P.rates.addOn.plus - P.rates.addOn.grad)) / 100;
const owed = 95000;
const rap = rapPayment({ agi: 72000, dependents: 1 }).payment;
const ibr = ibrPayment({ agi: 72000, familySize: 2, newBorrower: true, balance: owed, rate: H[1].plus }).payment;
const std = standard10(owed, H[1].plus);

export default definePage({
  id: 'grad-plus-ending',
  group: 'borrow',
  kind: 'guide',
  order: 130,
  slug: 'grad-plus-loans-ending',
  nav: 'Grad PLUS ending',
  card: 'Who can still use Grad PLUS, for how long, and what happens to existing loans',
  title: 'Grad PLUS Loans Ending 2026: Who Keeps Them and for How Long',
  description: `Grad PLUS loans ending in 2026: no new loans for terms from ${day(P.law.newPlansStart)}, except enrolled students for up to ${cap} academic years. Find your own window here.`,
  h1: 'Grad PLUS is closing: who keeps it, and for how long',
  intro: 'The federal loan that let graduate students borrow up to the full cost of a program is gone for new students, with a transition window for those already enrolled.',
  resume: `No new Grad PLUS loans can be made for periods of instruction that begin on or after ${day(P.law.newPlansStart)}. The only students who can still receive them are those who were enrolled in a graduate or professional program on June 30, 2026 and had already received a Direct Loan for that program; they keep the old limits, Grad PLUS included, for the expected time to credential. That period is the lesser of ${cap} academic years or the program’s published full-time length minus the part already completed, so a student with two years left is covered to graduation while one with five years left loses Grad PLUS after ${cap}. Withdrawing ends the exception for good; changing majors inside the same degree does not. Everyone else borrows only Direct Unsubsidized Loans, capped at ${usd(L.grad.annual)} a year for graduate students and ${usd(L.professional.annual)} for professional students. Existing Grad PLUS loans are not touched: they keep their fixed rate and remain eligible for the Repayment Assistance Plan and PSLF.`,
  mini: 'expectedTimeCredential',
  faqs: [
    { q: 'Can I still get a Grad PLUS loan in 2026-27?', a: `Only under the transition exception. You must have been enrolled in your program on June 30, 2026 and have received a Direct Loan for it, and the loan must fall inside your expected time to credential, at most ${cap} academic years. New graduate students, and continuing students who never borrowed for the program, borrow only Direct Unsubsidized Loans.` },
    { q: 'What happens to the Grad PLUS loans I already have?', a: `Nothing changes on the loan itself. The rate stays fixed, for example ${pct(H[1].plus)} on loans first disbursed in 2025-26. Grad PLUS loans count as eligible loans for the Repayment Assistance Plan, for IBR if all your loans predate ${day(P.law.newPlansStart)}, and for PSLF. Only parent PLUS loans face the narrower repayment rules.` },
    { q: 'How is expected time to credential calculated?', a: `Take the program length your school publishes for a full-time student, subtract the portion you had completed, and cap the result at ${cap} academic years. The Department uses the published length, not your personal pace, so part-time study or a delayed course sequence does not stretch the window. The clock counts from ${day(P.law.newPlansStart)}.` },
    { q: 'Do I lose the old limits if I change programs?', a: 'Changing majors within the same degree or certificate keeps you in the same program, so the exception continues. The protection is tied to the program you were enrolled in on June 30, 2026, though, and withdrawing from it or otherwise ceasing to be enrolled ends the exception, after which the new annual and aggregate caps apply.' },
    { q: 'Why was Grad PLUS eliminated?', a: `Congress ended new Grad PLUS loans in Public Law 119-21, signed ${day(P.law.enacted)}. The Department of Education describes the new caps as designed to keep students from taking on debt they may struggle to repay and to push institutions to reduce costs. The final rule of May 2026 applied the change without softening it, since the cutoff is written into the statute.` },
  ],
  body: (h) => `
<h2>What Grad PLUS did, and what replaced it</h2>
<p>Until 2026, Grad PLUS was the safety valve of graduate finance. A student first took the annual Direct Unsubsidized Loan, then borrowed the rest of the school’s cost of attendance minus other aid through a PLUS loan, with no fixed dollar ceiling. Expensive programs leaned on it heavily. The 2025 law ended new PLUS lending to graduate and professional students for periods of instruction starting on or after ${day(P.law.newPlansStart)}, and raised nothing to take its place except a higher annual cap for professional students (${h.src('obbba', 'Public Law 119-21, section 81001')}).</p>
<p>The result for a new student is a single federal loan with a hard ceiling: ${usd(L.grad.annual)} a year and ${usd(L.grad.aggregate)} in total for graduate programs, ${usd(L.professional.annual)} and ${usd(L.professional.aggregate)} for professional ones. The rate is lower than PLUS used to be, ${pct(R.grad)} against ${pct(R.plus)} on a PLUS loan disbursed this year, because the unsubsidized add-on is ${num(P.rates.addOn.plus - P.rates.addOn.grad, 0)} point smaller. On ${usd(oldPlus)} that difference alone is worth about ${usd(plusGap)} of interest a year. The limits themselves are set out on the ${h.a('graduate-loan-limits', 'graduate limits page')} and the ${h.a('professional-loan-limits', 'professional limits page')}.</p>
<h2>The transition exception in plain terms</h2>
<p>Congress did not cut off students halfway through a degree. A student keeps the old limits, Grad PLUS included, if two conditions were met on June 30, 2026: the student was enrolled in a program of study at the school, and a Direct Loan had been made for that program. The protection lasts for the expected time to credential and no longer.</p>
<p>That phrase has a precise meaning. The RISE final rule defines it as the lesser of ${cap} academic years or the period found by subtracting from the program length the portion the borrower has already completed, counted from ${day(P.law.newPlansStart)}. Program length is the minimum time the school’s catalog or official publications give for a full-time student to finish, a property of the program rather than of the student (${h.src('riseFinal', 'RISE final rule, preamble on program length and expected time to credential')}). Commenters asked the Department to use each student’s anticipated graduation date instead; it refused, on grounds of consistency across schools.</p>
${h.table(['Situation on June 30, 2026', 'Time left in the program', 'Old limits for', 'Under the new caps'], cases.map(([label, len, done]) => [label, yrs(len - done), yrs(etc(len, done)), yrs(Math.max(0, len - done - etc(len, done)))]), `Expected time to credential capped at ${cap} academic years. Student enrolled with a Direct Loan for the program.`, ['l', 'r', 'r', 'r'])}
<p>Short programs are fully protected. A master’s student with one year to go, or a four-year professional student who had finished the first year, borrows on the old terms until graduation. Long doctorates are where the window closes early: a student starting the second year of a five-year doctorate keeps Grad PLUS for ${cap} years and spends the final year under the ${usd(L.grad.annual)} cap, with whatever room is left under the ${usd(L.grad.aggregate)} aggregate. The mini-calculator above applies the definition to any program length.</p>
<h2>How the exception can be lost</h2>
<p>The regulation names one event that ends it: the student withdraws or otherwise stops being enrolled in the program. After that the new annual and aggregate caps apply. Changing majors within the same degree or certificate is treated as staying in the same program, so a doctoral student who moves from one concentration to another keeps the protection. A move to a different degree program is a different matter, since the exception attaches to the program in which the student was enrolled on June 30, 2026.</p>
<p>Students inside the window should also remember that Grad PLUS was never automatic. It still needs its own application each year, and the amount is still limited by cost of attendance minus other aid. Schools may now also set lower program-wide limits, which they must announce in advance (${h.src('ecfr203', '34 CFR 685.203(m)(2)')}).</p>
<h2>The same window shields more than Grad PLUS</h2>
<p>The expected time to credential is not a Grad PLUS rule alone. The regulation uses the same window, with the same June 30, 2026 conditions, to suspend two other new limits. A continuing student inside it is not held to the ${usd(L.lifetime)} lifetime cap on federal loans, which matters for someone who arrived at graduate school with a large undergraduate balance. And parents of a dependent undergraduate who was enrolled on that date, with a Direct Loan already made for the program, keep borrowing parent PLUS above the new ${usd(L.parentPlus.annual)} annual and ${usd(L.parentPlus.aggregate)} aggregate caps for the same period (${h.src('ecfr203', '34 CFR 685.203(f), (g) and (j)')}).</p>
<p>When the window closes, every cap applies at once, and loans borrowed under the exception count toward the new aggregates from that point. A student who borrowed heavily through Grad PLUS in the protected years may find little or no room left under the lifetime limit for a later degree. The ${h.a('lifetime-loan-limit', 'lifetime limit page')} shows how to add up what you have used.</p>
<h2>Repaying Grad PLUS loans you already hold</h2>
<p>Every Grad PLUS loan already disbursed stays on its original terms. Its rate is fixed for life, and it counts as an eligible loan for both income-driven plans that remain. Take a borrower who owes ${usd(owed)} of graduate loans at the ${pct(H[1].plus)} PLUS rate of 2025-26, earns ${usd(72000)} and has one dependent. On the Repayment Assistance Plan the payment would be about ${usd(rap)} a month; on IBR, available only while all of the borrower’s loans predate ${day(P.law.newPlansStart)}, about ${usd(ibr)}. The 10-year standard payment on the same balance is about ${usd(std)}. A borrower still in school under the exception should note that taking any Direct Loan on or after ${day(P.law.newPlansStart)}, including a new Grad PLUS loan, ends access to IBR and to the old fixed plans for all of their loans: from then on the choice is RAP or Tiered Standard, as explained in ${h.a('rap-vs-ibr', 'RAP vs IBR')}.</p>
<h2>Planning the years after the window</h2>
<p>A student whose expected time to credential ends before graduation should plan that final stretch now, while there is time to apply for fellowships, assistantships or teaching positions. The gap is easy to estimate: the cost of attendance for the uncovered years, minus expected aid, minus ${usd(L.grad.annual)} or ${usd(L.professional.annual)} a year of federal loans. Anything beyond that comes from savings, an employer, the school or a private lender. Private loans can be large, but they offer no income-driven plan and no PSLF, which matters a great deal to a graduate heading for public service. Borrowers who expect to work for a qualifying employer can check the value of staying federal with the ${h.a('pslf-calculator', 'PSLF calculator')}.</p>`,
  related: ['graduate-loan-limits', 'professional-loan-limits', 'how-much-student-loan', 'rap-vs-ibr', 'pslf-calculator', 'interest-rates'],
  sources: ['obbba', 'riseFinal', 'ecfr203', 'edJuly1'],
});
