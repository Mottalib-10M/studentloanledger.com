import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, rapPayment, ibrPayment, pslfProjection, tieredStandard, standard10 } from '../../lib/kit';

const ex = { bal: 75000, agi: 58000, made: 36, rate: 6.6 };
const rp = rapPayment({ agi: ex.agi, dependents: 0 }).payment;
const ip = ibrPayment({ agi: ex.agi, familySize: 1, newBorrower: true, balance: ex.bal, rate: ex.rate }).payment;
const onRap = pslfProjection({ balance: ex.bal, rate: ex.rate, payment: rp, madeSoFar: ex.made });
const onIbr = pslfProjection({ balance: ex.bal, rate: ex.rate, payment: ip, madeSoFar: ex.made });
const t = tieredStandard(ex.bal, ex.rate); const s = standard10(ex.bal, ex.rate);
const teacher = pslfProjection({ balance: 42000, rate: 6.53, payment: rapPayment({ agi: 51000, dependents: 2 }).payment, madeSoFar: 0 });

export default definePage({
  id: 'pslf-calculator',
  group: 'forgive',
  kind: 'pillar',
  order: 20,
  slug: 'pslf-calculator',
  nav: 'PSLF calculator',
  card: 'Payments left, what you pay until then and the tax-free amount forgiven',
  title: 'PSLF Calculator 2026: Payments Left and Amount Forgiven',
  description: `PSLF calculator 2026: payments left out of ${P.pslf.payments}, what you will pay on RAP or IBR until then, and how much is forgiven tax-free, with the July 2026 employer rule.`,
  h1: 'PSLF calculator',
  intro: 'How many qualifying payments you have left, what they will cost on each plan, and the balance Public Service Loan Forgiveness will cancel.',
  resume: `A public servant with ${usd(ex.bal)} of Direct Loans, a ${usd(ex.agi)} income and ${ex.made} qualifying payments already counted has ${onRap.left} payments to go. On the Repayment Assistance Plan they cost ${usd(rp)} a month, ${usd(onRap.paid)} in total, and about ${usd(onRap.forgiven)} would then be forgiven, tax-free. On IBR the payment would be ${usd(ip)} and the amount forgiven about ${usd(onIbr.forgiven)}. Public Service Loan Forgiveness cancels the remaining balance of Direct Loans after ${P.pslf.payments} qualifying monthly payments made while you work full time, at least ${P.pslf.hoursPerWeek} hours a week, for a government employer or a qualifying nonprofit. The 2025 law kept the program and added on-time RAP payments to the list of qualifying payments. What it did not do is make every plan count: the new Tiered Standard plan qualifies only when its payment is at least the 10-year standard amount, which for this borrower would mean ${usd(s)} a month, not the ${usd(t.payment)} the plan asks. The best PSLF plan is usually the one with the lowest payment.`,
  tool: 'pslf',
  toolProps: { balance: ex.bal, agi: ex.agi, made: ex.made },
  faqs: [
    { q: 'Which repayment plans qualify for PSLF in 2026?', a: 'Any income-driven plan, including IBR and RAP, the 10-year standard plan, any other plan whose payment is at least the 10-year standard amount, and income-contingent plans for payments made by June 30, 2028 (34 CFR 685.219). The Tiered Standard plan therefore counts only when its payment reaches the 10-year amount.' },
    { q: 'What is a qualifying employer for PSLF after July 1, 2026?', a: `A federal, state, local or tribal government organization, a 501(c)(3) nonprofit, or certain other nonprofits providing public services, but not organizations the Department determines have a substantial illegal purpose under the rule effective ${day(P.pslf.employerRuleFrom)}. For-profit companies, labor unions and partisan political organizations never qualify.` },
    { q: 'Do I have to work full time for PSLF?', a: `Yes. Full time means an average of at least ${P.pslf.hoursPerWeek} hours a week, which can be reached by combining qualifying jobs, or at least ${P.pslf.hoursPerWeek} hours a week for eight months of a twelve-month period for employees with a school-year contract. You must be full time when each payment counts, when you apply and when forgiveness is granted.` },
    { q: 'Should I pay more than the required amount if I expect PSLF?', a: 'No. PSLF forgives whatever remains after 120 qualifying payments, so extra money paid before then lowers the amount forgiven, not your total cost. Paying the full scheduled amount on time each month is what counts; a payment above it does not make the count go faster except in the limited cases the regulation allows.' },
    { q: 'Is PSLF forgiveness taxed?', a: 'Not by the federal government: section 108(f)(1) of the tax code excludes it, and the 2025 law did not touch that rule. This differs from forgiveness at the end of an income-driven plan, which lost its broad federal exclusion on January 1, 2026. State tax rules are outside the scope of this site.' },
    { q: 'Can parent PLUS borrowers get PSLF?', a: 'Only through a Direct Consolidation Loan repaid on a qualifying plan, and only for the parent’s own public service employment. For a consolidation that repaid parent PLUS loans, the qualifying options are ICR until June 30, 2028, and IBR if that consolidation was repaid under ICR, PAYE or IBR at least once by then.' },
  ],
  body: (h) => `
<h2>A teacher's ten years</h2>
<p>Take a public school teacher with ${usd(42000)} of undergraduate loans at ${pct(6.53)}, a ${usd(51000)} income and two children claimed as dependents. On RAP her payment is ${usd(rapPayment({ agi: 51000, dependents: 2 }).payment)} a month. After ${P.pslf.payments} payments she will have paid about ${usd(teacher.paid)} and see roughly ${usd(teacher.forgiven)} canceled. The RAP interest waiver keeps her balance from growing while she waits, which matters if she ever leaves public service before the ten years are up.</p>
<h2>Payments on each plan for the same borrower</h2>
${h.table(['Plan', 'Monthly payment', `Paid over ${onRap.left} more payments`, 'Forgiven at the end'], [['RAP', usd(rp), usd(onRap.paid), usd(onRap.forgiven)], ['IBR (new borrower)', usd(ip), usd(onIbr.paid), usd(onIbr.forgiven)], ['10-year standard', usd(s), 'pays off before 120', usd(0)], [`Tiered Standard (${t.years} years)`, usd(t.payment), 'does not qualify at this payment', 'n/a']], `${usd(ex.bal)} at ${pct(ex.rate)}, ${usd(ex.agi)} of AGI, single, ${ex.made} payments already counted.`, ['l', 'r', 'r', 'r'])}
<h2>What counts as a qualifying payment</h2>
<p>A payment counts when it covers the full scheduled amount, under a qualifying plan, on a Direct Loan that is not in default, while you are employed full time by a qualifying employer. Several installments that add up to the full amount count as one payment. On an income-driven plan, a lump sum paid ahead counts for the months it covers, up to your next annual recertification; on the 10-year standard plan, up to twelve months ahead. On RAP, an overpayment that advances your due date still counts for each month it covers, although those months earn no matching principal payment. Some deferment and forbearance months, such as cancer treatment, economic hardship or military service deferment, also count when you are not on RAP. The rules are in ${h.src('ecfr219', '34 CFR 685.219')} as revised by the regulations of ${day(P.law.riseFinalPublished)}.</p>
<h2>The employer rule effective July 1, 2026</h2>
<p>The final rule of ${day(P.pslf.employerRulePublished)} excludes from the definition of qualifying employer organizations that engage in activities with a substantial illegal purpose, such as aiding or abetting violations of federal immigration law or supporting terrorism. The Department applies it to employment from ${day(P.pslf.employerRuleFrom)}; the rule credits no payment for months after a determination against an employer, so payments made before it are not taken away. Details and the exact definition: ${h.a('pslf-employer-rule', 'the PSLF employer rule')}.</p>
<h2>Before you rely on the projection</h2>
<p>The calculator assumes your income stays at the figure you enter for the remaining years. Raises increase RAP and IBR payments and lower the amount forgiven, but they never push you off PSLF. Check your official count in the PSLF tracker on StudentAid.gov, certify employment at least once a year, and make sure your loans are Direct Loans: FFEL and Perkins loans must be consolidated into a Direct Loan first. When Direct Loans are consolidated, the weighted average of their qualifying payments carries over to the new loan. If you change employers, certify the old job before you leave: an employer that has closed or stopped answering is the most common reason a count stalls, and the regulation then lets the Department rely on other documentation of your employment.</p>`,
  related: ['public-service-loan-forgiveness', 'pslf-employer-rule', 'student-loan-forgiveness', 'rap-calculator', 'ibr-calculator', 'forgiveness-taxes'],
  sources: ['ecfr219', 'pslfRule', 'obbba', 'ecfr209', 'edPslf'],
});
