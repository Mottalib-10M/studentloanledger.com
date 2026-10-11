import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, amortized, rapPayment, pslfProjection } from '../../lib/kit';

const B = 60000;
const fed = amortized(B, R.grad, 120);
const priv = (rate: number) => amortized(B, rate, 120);
const pslf = pslfProjection({ balance: 90000, rate: R.grad, payment: rapPayment({ agi: 62000, dependents: 1 }).payment, madeSoFar: 48 });

export default definePage({
  id: 'student-loan-refinance-calculator',
  group: 'repay',
  kind: 'pillar',
  order: 60,
  slug: 'student-loan-refinance-calculator',
  nav: 'Refinance calculator',
  card: 'A private rate against your federal loans, and the protections refinancing gives up',
  title: 'Student Loan Refinance Calculator 2026: Federal vs Private',
  description: `Student loan refinance calculator 2026: compare a private rate with your ${pct(R.grad)} federal loans and see what you give up: RAP, IBR, PSLF and federal forgiveness.`,
  h1: 'Student loan refinance calculator',
  intro: 'What a lower private rate saves on paper, and the federal options that disappear the day the federal loans are paid off.',
  resume: `Refinancing ${usd(B)} of federal graduate loans at ${pct(R.grad)} into a private loan at 6% over the same ten years would lower the payment from ${usd(fed)} to ${usd(priv(6))} a month and save ${usd((fed - priv(6)) * 120)} of interest, if nothing goes wrong for a decade. That is the whole case for refinancing, and the calculator measures it with the rate a lender actually offers you. The other side of the ledger does not appear on the lender's quote. A private loan pays off your federal loans for good: you lose the Repayment Assistance Plan, whose payment follows your income and can fall to ${usd(P.rap.minPayment)}, Income-Based Repayment for older loans, Public Service Loan Forgiveness, forgiveness after 20 to 30 years of income-driven payments, and the federal deferments and forbearances. The 2025 law did not change that trade; it made the federal side more valuable for borrowers with modest incomes, through the RAP interest waiver, and less flexible for new borrowers, who now have two plans instead of many.`,
  tool: 'refi',
  toolProps: { balance: B },
  faqs: [
    { q: 'Can I refinance federal student loans back into federal loans later?', a: 'No. Once a private lender pays off your federal loans, they are gone, and a private loan cannot be consolidated into a Direct Consolidation Loan. The decision is one-way, which is why borrowers who might need an income-driven plan, a deferment or PSLF should compare carefully before signing.' },
    { q: 'Is refinancing worth it with a high income?', a: `It can be. With a stable high income, a balance you will repay in full and no public service job, the federal protections are worth less, and a lower rate saves real money. On ${usd(B)} over ten years, each percentage point of rate is worth roughly ${usd((priv(7.07) - priv(6.07)) * 120)} of interest. Compare the offer with the federal auto pay discount first.` },
    { q: 'Does refinancing affect PSLF?', a: 'It ends it. PSLF forgives only Direct Loans, so payments on a private loan never count, and the qualifying payments you already made are lost with the federal loans. A public servant with years of qualifying payments behind them almost always loses money by refinancing.' },
    { q: 'What rate will a private lender give me?', a: 'Private rates depend on your credit, income, debt and the lender; they are not set by law and this site does not publish or compare them. Enter the fixed rate from a written offer. A variable rate can start lower and rise later, which the calculator does not model.' },
    { q: 'Should I refinance parent PLUS loans?', a: `Parent PLUS loans carry ${pct(R.plus)} for 2026-27 and new ones can only be repaid on the Tiered Standard plan, so parents have fewer federal options to lose. They still give up death and disability discharge on federal terms and any income-driven route through consolidation. Read the parent PLUS repayment page before deciding.` },
    { q: 'Do private loans offer income-driven repayment?', a: 'Not in the federal sense. A lender may offer a temporary hardship forbearance or a reduced payment period under its own contract, at its discretion. No private loan is eligible for RAP, IBR or federal forgiveness, and federal discharge rules do not apply to it.' },
  ],
  body: (h) => `
<h2>What each rate saves on ${usd(B)}</h2>
<p>The table compares the federal 10-year payment at the 2026-27 graduate rate with private fixed rates over the same term. It shows the gross saving before you weigh what refinancing gives up.</p>
${h.table(['Rate', 'Monthly payment', 'Total over 10 years', 'Difference with federal'], [R.grad, 7, 6, 5, 4].map((r) => [pct(r), usd(priv(r)), usd(priv(r) * 120), usd((fed - priv(r)) * 120)]), `First line: federal graduate unsubsidized rate for loans first disbursed from ${day(R.from)}.`, ['l', 'r', 'r', 'r'])}
<h2>The federal options you give up</h2>
<p>The Repayment Assistance Plan sets the payment from income, not from the balance: 1% to 10% of AGI, minus ${usd(P.rap.perDependent)} per dependent. If your income falls by half after a job loss, so does the payment, and interest that an on-time payment does not cover is waived (${h.src('ecfr209', '34 CFR 685.209')}). Borrowers with loans made before ${day(P.law.newPlansStart)} also keep IBR. A private loan has none of this; the contract payment is due whatever happens to your income.</p>
<p>Public Service Loan Forgiveness is the largest item for many graduate borrowers. A nurse at a nonprofit hospital with ${usd(90000)} of loans at ${pct(R.grad)}, a ${usd(62000)} income, one child and 48 qualifying payments behind her would, on RAP, see about ${usd(pslf.forgiven)} forgiven tax-free after the remaining ${pslf.left} payments. Refinancing would turn that into a debt to repay in full.</p>
<h2>Discharge and hardship</h2>
<p>Federal loans are discharged on the borrower's death or total and permanent disability, and since 2026 such discharges remain excluded from federal income by section 108(f)(5) of the tax code, which now also covers private education loans (${h.src('obbba', 'Public Law 119-21, section 70119')}). Whether a private lender cancels a loan on death or disability depends on its contract. Federal deferments for unemployment and economic hardship still exist for loans made before ${day(P.law.deferSunsetLoansFrom)}; private hardship programs are discretionary.</p>
<h2>Refinancing only part of the debt</h2>
<p>Nothing forces you to move everything. A borrower can refinance the highest-rate federal loans, often graduate PLUS loans taken before ${day(P.law.newPlansStart)}, and keep the rest on a federal plan. The federal loans left behind still qualify for RAP or IBR on their own balance. The calculator works loan by loan: enter only the balance you are considering.</p>
<h2>Lower the federal rate first</h2>
<p>Before comparing offers, check the federal auto pay discount: ${pct(P.autopay.standardCut)} off normally, and ${pct(P.autopay.promoCut)} in total for borrowers enrolled by ${day(P.autopay.promoEnrollBy)}, until ${day(P.autopay.promoUntil)} (${h.src('edAutopayExtend', 'Department of Education')}). On a ${pct(R.grad)} loan that brings the rate to ${pct(Math.round((R.grad - P.autopay.promoCut) * 100) / 100)} for the period, which narrows the gap with many private offers while keeping every federal option. Then run your case in the ${h.a('home', 'plan comparator')} to see whether an income-driven plan would forgive part of the balance; if it would, refinancing gives that away.</p>`,
  related: ['home', 'student-loan-payoff-calculator', 'pslf-calculator', 'rap-calculator', 'autopay-rate-reduction', 'parent-plus-repayment'],
  sources: ['ecfr209', 'obbba', 'ratesNotice', 'edAutopayExtend'],
});
