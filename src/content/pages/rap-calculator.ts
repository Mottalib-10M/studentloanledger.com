import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, rapPayment, simulateRap, monthInterest } from '../../lib/kit';

const A = 45000;
const one = rapPayment({ agi: A, dependents: 0 }).payment;
const two = rapPayment({ agi: A, dependents: 2 }).payment;
const sim = simulateRap({ balance: 35000, rate: R.undergrad, agi: A, growth: 0, dependents: 0 });
const i1 = monthInterest(35000, R.undergrad);
const step = (a: number) => rapPayment({ agi: a, dependents: 0 }).payment;

export default definePage({
  id: 'rap-calculator',
  group: 'repay',
  kind: 'pillar',
  order: 10,
  slug: 'rap-calculator',
  nav: 'RAP calculator',
  card: 'Repayment Assistance Plan payment, interest waiver, $50 match and payoff date',
  title: 'RAP Calculator 2026: Repayment Assistance Plan Payment',
  description: `RAP calculator 2026: your Repayment Assistance Plan payment from your AGI and dependents, the $${P.rap.minPayment} floor, the waived interest and the $${P.rap.matchMax} principal match.`,
  h1: 'Repayment Assistance Plan calculator',
  intro: 'The new income-driven plan, open since July 1, 2026, computed with the brackets of the law and simulated until payoff or forgiveness.',
  resume: `With ${usd(A)} of adjusted gross income and no dependent, the Repayment Assistance Plan asks ${usd(one)} a month: 4% of the whole income, divided by 12. Two dependents bring it down to ${usd(two)}, because RAP takes ${usd(P.rap.perDependent)} off for each one, and no payment ever falls below ${usd(P.rap.minPayment)}. The plan opened on ${day(P.law.newPlansStart)} under section 455(q) of the Higher Education Act, written by the 2025 budget law, and the Department of Education set its details in the regulations of ${day(P.law.riseFinalPublished)}. Two features change what the payment does to your balance. Interest your on-time payment does not cover is not charged, and when the payment reduces principal by less than ${usd(P.rap.matchMax)}, the Department adds the difference. On a ${usd(35000)} balance at ${pct(R.undergrad)}, that means about ${usd(i1 - one)} of interest waived and a ${usd(P.rap.matchMax)} match in the first month. Any balance left after ${P.rap.payments} qualifying payments is forgiven.`,
  tool: 'rap',
  toolProps: { agi: A, balance: 35000 },
  faqs: [
    { q: 'How is the RAP payment calculated in 2026?', a: `Find the bracket of your adjusted gross income: ${usd(P.rap.floorBase)} a year if it is ${usd(10000)} or less, then 1% of the whole AGI above ${usd(10000)}, rising one point per ${usd(10000)} to 10% above ${usd(100000)}. Divide by 12, subtract ${usd(P.rap.perDependent)} per dependent on your return, and the payment is at least ${usd(P.rap.minPayment)}. That is section 455(q)(4) of the Higher Education Act.` },
    { q: 'Does a raise of a few dollars really increase my RAP payment a lot?', a: `It can, because the rate applies to all of the income once you cross a ${usd(10000)} line. Going from ${usd(59900)} to ${usd(60100)} of AGI moves the single borrower's payment from ${usd(step(59900))} to ${usd(step(60100))} a month. Contributions to a traditional 401(k) or IRA lower AGI, which is the figure RAP reads.` },
    { q: 'Who counts as a dependent for RAP?', a: `A person who qualifies as your dependent under section 152 of the tax code and whom you claimed on your federal return. If you are married and file separately, only the dependents on your own return count. Each one lowers the monthly payment by ${usd(P.rap.perDependent)}, down to the ${usd(P.rap.minPayment)} floor.` },
    { q: 'Does my spouse’s income count on RAP?', a: `Only on a joint return. Married filing jointly, RAP uses the couple's combined AGI, and if your spouse also has eligible federal loans the payment is multiplied by your share of the two balances, with a ${usd(P.rap.minPayment)} minimum. Filing separately, RAP uses your AGI alone, which can lower the payment but may cost tax credits.` },
    { q: 'What happens to unpaid interest on the Repayment Assistance Plan?', a: `If your payment arrives on time and does not cover the month's interest, the rest is not charged (34 CFR 685.209(h)(4)). A late payment loses that month's waiver. The rule is what keeps balances from growing on RAP, unlike IBR, where unpaid interest keeps accruing.` },
    { q: 'Which loans can be repaid under RAP?', a: 'Direct Subsidized and Unsubsidized Loans, Direct PLUS loans made to graduate or professional students, and Direct Consolidation Loans that did not repay a parent PLUS loan. Parent PLUS loans and consolidations that repaid them are excluded, and FFEL loans must first be consolidated into a Direct Loan. Defaulted Direct Loans can also be repaid under RAP.' },
    { q: 'When is the remaining balance forgiven on RAP?', a: `After ${P.rap.payments} qualifying monthly payments, about ${P.rap.years} years, provided your last payment before cancellation was made under RAP. Payments made earlier under IBR, the 10-year standard plan or, before July 1, 2028, an income-contingent plan can count toward the total, as can months of unemployment or economic hardship deferment.` },
  ],
  body: (h) => `
<h2>The brackets, step by step</h2>
<p>RAP does not protect a slice of income the way IBR does with 150% of the poverty guideline. It reads one number from your tax return, adjusted gross income, and applies a single percentage to it. At ${usd(30000)} the rate is 2% and the payment ${usd(step(30000))} a month; at ${usd(30001)} the rate becomes 3% and the payment ${usd(step(30001))}. The table below shows the payment at the top of each bracket for a borrower without dependents.</p>
${h.table(['AGI', 'Rate', 'Monthly payment, no dependent', 'With 2 dependents'], [20000, 40000, 60000, 80000, 100000, 120000].map((a) => [usd(a), `${rapPayment({ agi: a, dependents: 0 }).pct}%`, usd(step(a)), usd(rapPayment({ agi: a, dependents: 2 }).payment)]), 'Computed with the brackets of HEA 455(q)(4)(B)(iv); $10 minimum.', ['l', 'r', 'r', 'r'])}
<h2>What a month on RAP does to the balance</h2>
<p>Take the example of the Department's fact sheet of June 2026: ${usd(35000)} of loans, ${usd(A)} of income, no dependent. At ${pct(R.undergrad)}, the month's interest is ${usd(i1)}. The ${usd(one)} payment covers ${usd(one)} of it; the remaining ${usd(i1 - one)} is waived. Nothing went to principal, so the Department reduces principal by ${usd(P.rap.matchMax)}. The balance falls even though the payment never touched principal. Over the whole plan, at a flat income, this borrower would ${sim.paidOff ? `pay off the loans in ${Math.ceil(sim.months / 12)} years` : `still owe ${usd(sim.forgiven)} after ${P.rap.payments} payments, which would be forgiven`}, with ${usd(sim.interestWaived)} of interest waived and ${usd(sim.matched)} of matching payments along the way.</p>
<p>The waiver and the match require an on-time payment for the month. Paying ahead normally advances your due date, and a month without a due date earns no match, so the regulation lets you ask the servicer not to advance it. ${h.a('rap-interest-waiver-and-match', 'How the waiver and the match work')}.</p>
<h2>RAP or another plan</h2>
<p>RAP is not always the cheapest monthly option. With a low income, IBR often asks less because the first ${usd(h.ibrLine(1))} of a single borrower's income is ignored; with a high income and a small balance, the Tiered Standard plan can cost less in total because it ends sooner. A borrower with a loan made on or after ${day(P.law.newPlansStart)} can only choose between RAP and Tiered Standard. Run your case in the ${h.a('home', 'plan comparator')}, or read ${h.a('rap-vs-ibr', 'RAP vs IBR')}.</p>
<h2>Recertification and missing paperwork</h2>
<p>Your payment is set for 12 months from the income the Department gets from the IRS with your consent, or from documents you send. If income drops, you can ask for a new calculation at any time. If the Department asks for information and you do not provide it, the payment becomes what you would owe on a 10-year standard plan based on the balance when the loans entered repayment, until you answer. That amount is usually much higher, which is the practical reason to keep the IRS consent in place.</p>
<h2>PSLF and RAP</h2>
<p>On-time RAP payments count toward Public Service Loan Forgiveness: the 2025 law added them to the list in section 455(m). A public servant on RAP can therefore reach the 120 payments with a low payment and have the rest forgiven tax-free. ${h.a('pslf-calculator', 'PSLF calculator')}.</p>
<p>Sources: ${h.src('obbba', 'Public Law 119-21, section 82001(d)')}, ${h.src('ecfr209', '34 CFR 685.209')}, ${h.src('edFactSheet', 'Department of Education fact sheet of June 9, 2026')}.</p>`,
  related: ['home', 'rap-vs-ibr', 'rap-interest-waiver-and-match', 'ibr-calculator', 'pslf-calculator', 'married-borrowers'],
  sources: ['obbba', 'riseFinal', 'ecfr209', 'edFactSheet', 'edJuly1'],
});
