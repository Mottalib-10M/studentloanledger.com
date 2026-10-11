import { definePage } from '../../lib/page-types';
import { P, R, usd, usdx, pct, day, dailyInterest, monthInterest, rapPayment } from '../../lib/kit';

const U = 27000; const d = dailyInterest(U, R.undergrad); const m = monthInterest(U, R.undergrad);
const G = 41000; const gd = dailyInterest(G, R.grad);
const grace = monthInterest(G, R.grad) * 6;
const school = (amount: number, rate: number, months: number) => monthInterest(amount, rate) * months;

export default definePage({
  id: 'student-loan-interest-calculator',
  group: 'repay',
  kind: 'pillar',
  order: 50,
  slug: 'student-loan-interest-calculator',
  nav: 'Interest calculator',
  card: 'Daily and monthly interest, and what builds up in school, grace or forbearance',
  title: 'Student Loan Interest Calculator 2026: Daily, Monthly Cost',
  description: `Student loan interest calculator 2026: ${usd(U)} at ${pct(R.undergrad)} costs about ${usdx(Math.round(d * 100) / 100)} a day; see what builds up in school, grace and forbearance at the 2026-27 rates.`,
  h1: 'Student loan interest calculator',
  intro: 'How much interest a federal loan charges each day and each month, and how much piles up while no payment is due.',
  resume: `A ${usd(U)} undergraduate balance at the 2026-27 rate of ${pct(R.undergrad)} accrues about ${usdx(Math.round(d * 100) / 100)} of interest a day, or ${usd(m)} a month. Federal Direct Loans charge simple interest that accrues daily on the principal, and interest is not charged on interest until it is capitalized. The rate is fixed for the life of each loan and set by the year of its first disbursement: ${pct(R.undergrad)} for undergraduate loans, ${pct(R.grad)} for graduate unsubsidized loans and ${pct(R.plus)} for PLUS loans first disbursed from ${day(R.from)} to ${day(R.to)}. Interest matters most when no payment is due. Unsubsidized and PLUS loans accrue it from the first disbursement, through school and the grace period, while subsidized loans do not charge you interest during school at least half time. On the Repayment Assistance Plan the picture changes again, because interest that an on-time payment does not cover is waived. This calculator gives the daily and monthly figure for any balance and rate, and the total for a period without payments.`,
  tool: 'interest',
  toolProps: { balance: U },
  faqs: [
    { q: 'How is interest calculated on a federal student loan?', a: `As simple interest accruing every day on the principal, roughly the yearly rate divided by the days of the year. On ${usd(G)} of graduate loans at ${pct(R.grad)} that is about ${usdx(Math.round(gd * 100) / 100)} a day. Your payment covers the interest accrued since the last one first, and only the rest reduces principal, which is why early payments on a long plan feel slow.` },
    { q: 'Does interest accrue while I am in school?', a: 'On Direct Unsubsidized and PLUS loans, yes, from the day the money is disbursed. On Direct Subsidized loans, available to undergraduates with financial need, you are not charged interest while enrolled at least half time or during the grace period. You can pay the in-school interest as it accrues to keep the balance from growing.' },
    { q: 'What does capitalized interest mean?', a: 'Capitalization adds unpaid interest to the principal, after which interest is charged on the larger amount. On IBR it happens when you leave the plan or when your payment hits the 10-year standard cap. Paying accrued interest before it is capitalized keeps the principal, and the future interest, lower.' },
    { q: 'Why did my balance go up during forbearance?', a: 'During most forbearances, and on deferment of unsubsidized loans, interest keeps accruing while no payment is due. Former SAVE borrowers saw it after August 1, 2025, when interest resumed on loans in the SAVE forbearance. The calculator estimates the amount for any number of months without payment.' },
    { q: 'Can the interest rate on my federal loan change?', a: `Not on loans first disbursed since July 1, 2006, which are fixed. A new loan each year can carry a different rate, so a borrower who took loans in 2025 and 2026 holds ${pct(P.rates.history[1].undergrad)} and ${pct(R.undergrad)} loans side by side. The only reduction available on an existing loan is the auto pay discount from your servicer.` },
    { q: 'Is student loan interest tax deductible?', a: `Up to ${usd(P.deduction.max)} a year of interest paid can be deducted for tax year 2026, phased out between ${usd(P.deduction.single[0])} and ${usd(P.deduction.single[1])} of modified AGI for a single filer and ${usd(P.deduction.joint[0])} to ${usd(P.deduction.joint[1])} on a joint return. Married people filing separately cannot claim it. The deduction is taken without itemizing.` },
  ],
  body: (h) => `
<h2>What builds up before the first bill</h2>
<p>Interest on unsubsidized loans runs through the years of study and the six-month grace period. The table estimates it on one year's loan at the 2026-27 rates, from disbursement to the first payment, using simple interest and no payments in between.</p>
${h.table(['Loan', 'Rate', 'Amount', 'Interest after 4 years and 6 months', 'After 2 years and 6 months'], [['Undergraduate unsubsidized', pct(R.undergrad), usd(2000), usd(school(2000, R.undergrad, 54)), usd(school(2000, R.undergrad, 30))], ['Graduate unsubsidized', pct(R.grad), usd(P.limits.grad.annual), usd(school(P.limits.grad.annual, R.grad, 54)), usd(school(P.limits.grad.annual, R.grad, 30))], ['Parent PLUS', pct(R.plus), usd(10000), usd(school(10000, R.plus, 54)), usd(school(10000, R.plus, 30))]], 'Estimates. Subsidized loans are excluded: you are not charged interest on them in school.', ['l', 'r', 'r', 'r', 'r'])}
<p>The grace period alone costs a graduate borrower with ${usd(G)} of unsubsidized loans about ${usd(grace)}. Paying that interest during the six months, even in small amounts, keeps it from turning into principal at the next capitalization event.</p>
<h2>Interest on the new plans</h2>
<p>Interest is computed the same way on every plan; what differs is what happens when the payment falls short. On IBR the shortfall accrues. On the Repayment Assistance Plan it is not charged when the payment arrives on time (${h.src('ecfr209', '34 CFR 685.209(h)(4)')}). A borrower with ${usd(U)} at ${pct(R.undergrad)} and an income of ${usd(24000)} pays ${usd(rapPayment({ agi: 24000, dependents: 0 }).payment)} on RAP while ${usd(m)} of interest accrues each month: the difference is waived, and the Department also cuts principal by up to ${usd(P.rap.matchMax)}. The ${h.a('rap-interest-waiver-and-match', 'waiver and matching payment page')} walks through a full month.</p>
<h2>Where the rate comes from</h2>
<p>Each year the rate for new loans equals the high yield of the 10-year Treasury note sold at the last auction before June 1, plus a fixed add-on: ${pct(P.rates.addOn.undergrad)} for undergraduates, ${pct(P.rates.addOn.grad)} for graduate unsubsidized loans and ${pct(P.rates.addOn.plus)} for PLUS loans, with caps of ${pct(P.rates.cap.undergrad)}, ${pct(P.rates.cap.grad)} and ${pct(P.rates.cap.plus)}. The ${day(P.rates.auction)} auction yielded ${pct(P.rates.treasury)}, which produced the 2026-27 rates (${h.src('ratesNotice', 'Federal Register, September 10, 2026')}). The ${h.a('interest-rates', 'interest rate page')} compares the last four years.</p>
<h2>Reading your servicer statement</h2>
<p>Each statement splits the last payment between interest and principal and shows the interest accrued but not yet paid. If that unpaid figure grows from month to month, your payment is below the interest, which happens on IBR with a low income or during a forbearance. If it stays at zero and principal falls, your plan is amortizing the loan. Compare the interest line with the monthly figure this calculator gives for your balance and rate: a large gap usually means several loans at different rates, or interest capitalized earlier that raised the principal.</p>
<h2>Lowering what you pay in interest</h2>
<p>Three levers exist on federal loans: auto pay, which cuts the rate by ${pct(P.autopay.standardCut)} and by ${pct(P.autopay.promoCut)} in total under the offer open until ${day(P.autopay.promoEnrollBy)}; paying interest during school and grace; and prepaying principal, measured by the ${h.a('student-loan-payoff-calculator', 'payoff calculator')}. Refinancing with a private lender can lower the rate but ends access to federal plans and forgiveness, as the ${h.a('student-loan-refinance-calculator', 'refinance calculator')} shows.</p>`,
  related: ['interest-rates', 'student-loan-payoff-calculator', 'rap-interest-waiver-and-match', 'autopay-rate-reduction', 'student-loan-interest-deduction', 'deferment-forbearance'],
  sources: ['ratesNotice', 'ecfr209', 'edAutopayExtend', 'irsRp2532'],
});
