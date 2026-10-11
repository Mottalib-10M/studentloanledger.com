import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, num, tieredStandard, rapPayment, monthInterest } from '../../lib/kit';

const PR = P.limits.professional; const L = P.limits;
const law = PR.annual * 3; const med = Math.min(PR.annual * 4, PR.aggregate);
const priorMasters = 41000;
const afterMasters = PR.aggregate - priorMasters;
const yrsAfter = afterMasters / PR.annual;
const lastSlice = afterMasters - PR.annual * Math.floor(yrsAfter);
const depPath = L.depUndergrad.aggregate + PR.aggregate;
const indPath = L.indUndergrad.aggregate + PR.aggregate;
const full = tieredStandard(PR.aggregate, R.grad);
const lawPay = tieredStandard(law, R.grad);
const trainee = rapPayment({ agi: 64000, dependents: 0 }).payment;
const later = rapPayment({ agi: 230000, dependents: 2 }).payment;
const accrue = monthInterest(med, R.grad);

export default definePage({
  id: 'professional-loan-limits',
  group: 'borrow',
  kind: 'guide',
  order: 120,
  slug: 'professional-student-loan-limits',
  nav: 'Professional loan limits',
  card: 'Federal caps for law, medical and dental students, and how many years they last',
  title: 'Professional Student Loan Limits 2026-27: Law and Medicine',
  description: `Professional student loan limits 2026-27: ${usd(PR.annual)} a year and ${usd(PR.aggregate)} in total for law, medical and dental students, shared with any graduate loans you hold.`,
  h1: 'Loan limits for law, medical and dental students',
  intro: 'Professional degree students got a higher federal cap than other graduate students, but one that a four-year program can use up entirely.',
  resume: `A student in a professional degree program such as law, medicine or dentistry can borrow up to ${usd(PR.annual)} a year in Direct Unsubsidized Loans from ${day(P.law.newPlansStart)}, and ${usd(PR.aggregate)} over a professional career, at the 2026-27 graduate rate of ${pct(R.grad)}. That ${usd(PR.aggregate)} is also the combined ceiling for graduate and professional borrowing together, so loans taken for an earlier master’s shrink it. A four-year medical or dental program borrowed at the full annual amount lands on the cap exactly, with ${usd(med)}; a three-year law degree uses ${usd(law)} and leaves ${usd(PR.aggregate - law)} of room. Grad PLUS, which used to cover the rest of the cost of attendance, is closed to new periods of instruction, so any cost above ${usd(PR.annual)} a year now needs scholarships, savings or private credit. Students enrolled on June 30, 2026 who already had a Direct Loan for the program keep the old rules for up to ${L.legacyYearsMax} academic years. Above all of it sits the ${usd(L.lifetime)} lifetime limit.`,
  mini: 'profCapYears',
  faqs: [
    { q: 'How much can a medical student borrow in federal loans in 2026-27?', a: `${usd(PR.annual)} a year in Direct Unsubsidized Loans, at ${pct(R.grad)} for loans first disbursed this award year, up to ${usd(PR.aggregate)} in total. Four years at the full amount reach that total exactly, which leaves nothing federal for a fifth year or for a later graduate program. Cost of attendance minus other aid can lower the yearly amount.` },
    { q: 'What is the federal loan limit for law school now?', a: `Law is a professional degree, so a full-time J.D. student can borrow up to ${usd(PR.annual)} a year and ${usd(PR.aggregate)} overall. Three years at the maximum come to ${usd(law)}. Students who began law school before July 2026 with a Direct Loan for it can keep Grad PLUS for the expected time to finish, at most ${L.legacyYearsMax} academic years.` },
    { q: 'Do my master’s degree loans count against the professional cap?', a: `Yes, for graduate loans counted under the new rules. Graduate and professional borrowing share one ${usd(PR.aggregate)} ceiling, so a student with ${usd(priorMasters)} from a master’s has ${usd(afterMasters)} left for law or medical school, about ${num(yrsAfter, 1)} years at the full annual amount. The mini-calculator shows which limit runs out first.` },
    { q: 'Which programs count as professional degrees for the higher limit?', a: `Programs that meet the professional degree framework the 2025 law borrowed from 34 CFR 668.2, which the RISE final rule turned into an enumerated list. Law, medicine and dentistry are on it. The Department rejected classification by program title or licensing alone, so ask your school how it codes your program before you rely on ${usd(PR.annual)} a year.` },
    { q: `Is the ${usd(PR.aggregate)} professional cap separate from the lifetime limit?`, a: `It sits inside it. The ${usd(L.lifetime)} lifetime limit counts every federal student loan you borrow as a student, undergraduate included, and ignores repayment. An independent undergraduate who borrowed the full ${usd(L.indUndergrad.aggregate)} and then the full professional amount would reach ${usd(indPath)}, ${indPath === L.lifetime ? 'which is exactly the lifetime limit' : 'against the lifetime limit'}.` },
  ],
  body: (h) => `
<h2>Three degrees, one ${usd(PR.aggregate)} ceiling</h2>
${h.table(['Program, at the full annual amount', 'Federal loans borrowed', 'Room left under the cap', 'Tiered Standard payment'], [
  ['Law, 3 years', usd(law), usd(PR.aggregate - law), `${usd(lawPay.payment)} for ${lawPay.years} years`],
  ['Medicine, 4 years', usd(med), usd(PR.aggregate - med), `${usd(full.payment)} for ${full.years} years`],
  ['Dentistry, 4 years', usd(med), usd(PR.aggregate - med), `${usd(full.payment)} for ${full.years} years`],
  [`Medicine after a ${usd(priorMasters)} master’s`, usd(PR.aggregate), usd(0), `${usd(full.payment)} for ${full.years} years`],
], `At ${pct(R.grad)}, before interest accrued in school. The last line reaches the cap during year ${Math.ceil(yrsAfter)}.`, ['l', 'r', 'r', 'r'])}
<p>The law that created these numbers, section 81001 of Public Law 119-21, gave professional students ${num(PR.annual / L.grad.annual, 1)} times the graduate annual limit of ${usd(L.grad.annual)} and ${num(PR.aggregate / L.grad.aggregate, 0)} times the graduate aggregate of ${usd(L.grad.aggregate)}. It also stated that the two categories share a single ${usd(PR.aggregate)} combined limit, so a student cannot stack a full graduate career on top of a full professional one (${h.src('obbba', 'HEA section 455(a)(4), added by section 81001')}). The ${h.a('graduate-loan-limits', 'graduate limits page')} covers students on the other side of that line.</p>
<h2>Who counts as a professional student</h2>
<p>The category is narrower than everyday usage. A professional student is one enrolled in a program that awards a professional degree as the regulations define it, a framework tied to the list in 34 CFR 668.2. The RISE final rule turned that framework into an enumerated list of degrees and declined to sort programs by title, by licensing requirements or by how many graduates go on to practice (${h.src('riseFinal', 'RISE final regulations, preamble on professional students')}). Law, medicine and dentistry are clear cases. For anything else, the school’s classification of your specific program decides the cap, and it is worth getting that answer in writing before you sign an enrollment deposit.</p>
<p>Joint degrees follow a credit-hour test. When one program awards both a graduate degree and a professional degree, the student is treated as professional only if more than half of the program’s credit hours count toward the professional degree (${h.src('ecfr203', '34 CFR 685.203(l)')}). The split is a fact about the curriculum, so the registrar or aid office can tell you which side your joint program falls on before you borrow for it.</p>
<h2>When the money runs out before the degree does</h2>
<p>The cap is generous for a standard program and tight for anything longer. A student who first earns a master’s with ${usd(priorMasters)} of graduate loans arrives at medical school with ${usd(afterMasters)} of room: three full years at ${usd(PR.annual)}, then ${usd(lastSlice)} in the fourth year. A dual M.D. and research program, an extra year to repeat coursework, or a transfer between schools can each push borrowing past the ceiling. Part-time enrollment does not help, because the annual amount is prorated while the aggregate is not.</p>
<p>The lifetime limit adds a second check. A dependent undergraduate who borrowed the full ${usd(L.depUndergrad.aggregate)} and then the full professional amount reaches ${usd(depPath)}, leaving ${usd(L.lifetime - depPath)} under the ${usd(L.lifetime)} lifetime ceiling. An independent undergraduate on the same path reaches ${usd(indPath)}${indPath === L.lifetime ? ', exactly the lifetime limit, so nothing federal remains for any later study' : ''}. Borrowers with large loans from before 2026 should run the mini-calculator with their old balances included, since repaid loans still count. The ${h.a('lifetime-loan-limit', 'lifetime limit page')} has the detail.</p>
<h2>Covering tuition above ${usd(PR.annual)} a year</h2>
<p>Where the annual cost of attendance is well above ${usd(PR.annual)}, the difference used to be one more federal loan. Now it is a funding plan. The Department’s July 2026 fact sheet highlights schools responding with their own money: it says the University of Kansas will offer new law scholarships and use its endowment to lend to law students at a rate below the federal one, and that Santa Clara Law launched a ${usd(16000)} “Pledge Scholarship” for every incoming first-year J.D. student (${h.src('edJuly1', 'Department of Education, July 1, 2026')}). Those are the Department’s descriptions; check the terms with each school.</p>
<p>Outside school aid, the choices are family savings, service-based scholarships with work commitments, and private loans. Private credit can fill any amount the lender approves, but it carries no access to the Repayment Assistance Plan, no PSLF and a rate set by your credit file rather than by statute. A student weighing a private loan for the last year of a program should compare it with the cost of a cheaper program, not only with other lenders.</p>
<h2>Students who started before July 2026</h2>
<p>The new caps do not reach everyone at once. A student who was enrolled in a professional program on June 30, 2026 and had already received a Direct Loan for it keeps the previous limits, Grad PLUS included, for the expected time to credential. That period is the lesser of ${L.legacyYearsMax} academic years or the program’s published full-time length minus the part already completed, counted from ${day(P.law.newPlansStart)} (${h.src('ecfr203', '34 CFR 685.203')}).</p>
<p>Applied to the three degrees, the rule covers most continuing students. A medical student who had finished the first of four years has three years left, all inside the window, so the whole degree runs under the old rules. A law student who had finished one year of a three-year J.D. has two years left and is covered to graduation. A student admitted for fall 2026 who was not yet enrolled on June 30 gets no exception at all and borrows under the ${usd(PR.annual)} cap from the first day. Programs longer than four years are where the window can close early, for example a combined degree with four or more years still to go.</p>
<p>The exception is fragile. Withdrawing from the program, or otherwise ceasing to be enrolled in it, ends it, and the new limits then apply. Changing majors within the same degree counts as staying in the same program. The ${h.a('grad-plus-ending', 'Grad PLUS page')} has a calculator for the expected time to credential.</p>
<h2>What the full balance costs after graduation</h2>
<p>Interest is the hidden part of a professional degree. A balance of ${usd(med)} at ${pct(R.grad)} accrues about ${usd(accrue)} a month once fully disbursed, and the loans taken in the first year have been accruing for three years by then. On the Tiered Standard plan the full ${usd(PR.aggregate)} carries a ${full.years}-year term at about ${usd(full.payment)} a month. The Repayment Assistance Plan follows income instead: a single trainee earning ${usd(64000)} would pay about ${usd(trainee)} a month, and the same borrower later earning ${usd(230000)} with two dependents about ${usd(later)}. Professional graduates working for a qualifying employer can count RAP payments toward ${h.a('pslf-calculator', 'Public Service Loan Forgiveness')} after 120 of them. The ${h.a('rap-calculator', 'RAP calculator')} runs those numbers on your own income path.</p>`,
  related: ['graduate-loan-limits', 'how-much-student-loan', 'grad-plus-ending', 'lifetime-loan-limit', 'pslf-calculator', 'rap-calculator'],
  sources: ['ecfr203', 'obbba', 'riseFinal', 'edJuly1'],
});
