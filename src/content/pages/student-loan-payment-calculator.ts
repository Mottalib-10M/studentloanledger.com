import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, standard10, tieredStandard, amortized } from '../../lib/kit';

const B = 30000;
const s10 = standard10(B, R.undergrad);
const tier = tieredStandard(B, R.undergrad);
const big = tieredStandard(120000, R.grad);
const row = (b: number, r: number) => { const t = tieredStandard(b, r); return [usd(b), pct(r), usd(standard10(b, r)), `${usd(t.payment)} (${t.years} yrs)`]; };

export default definePage({
  id: 'student-loan-payment-calculator',
  group: 'repay',
  kind: 'pillar',
  order: 20,
  slug: 'student-loan-payment-calculator',
  nav: 'Payment calculator',
  card: 'Monthly payment on the 10-year standard, the Tiered Standard plan or a term you choose',
  title: 'Student Loan Payment Calculator 2026: Fixed Plans Compared',
  description: `Student loan payment calculator 2026: monthly payment on the 10-year plan or the new Tiered Standard plan of 10 to 25 years, at the ${pct(R.undergrad)} or ${pct(R.grad)} rates.`,
  h1: 'Student loan payment calculator',
  intro: 'What a fixed federal plan costs each month and over its whole term, with the term the 2025 law now ties to your balance.',
  resume: `A ${usd(B)} federal balance at ${pct(R.undergrad)} costs ${usd(s10)} a month on the 10-year standard plan and ${usd(tier.payment)} on the Tiered Standard plan, which stretches that balance over ${tier.years} years. The second plan exists since ${day(P.law.newPlansStart)}: the 2025 budget law replaced the one-size 10-year schedule with terms set by the total principal you owe when you enter repayment, 10 years under ${usd(25000)}, 15 from ${usd(25000)}, 20 from ${usd(50000)} and 25 from ${usd(100000)}. Anyone with a Direct Loan made on or after that date gets the Tiered Standard plan by default and can switch to the Repayment Assistance Plan at any time. Borrowers whose loans are all older keep the 10-year plan. Both are fixed: the payment does not follow your income, and the longer term lowers it at the price of more interest. This calculator shows the payment, the number of payments and the interest for each, and a term of your own choice for comparison.`,
  tool: 'payment',
  toolProps: { balance: B },
  faqs: [
    { q: 'What is the minimum monthly payment on a federal student loan?', a: `On the 10-year standard and the Tiered Standard plans the payment is at least ${usd(P.standard.minPayment)} a month, except the last one, or the balance if it is lower (34 CFR 685.208). Income-driven plans go lower: the Repayment Assistance Plan never asks less than ${usd(P.rap.minPayment)}, and IBR can be ${usd(0)} for a low income.` },
    { q: 'Which balance decides my Tiered Standard term?', a: 'The total outstanding principal of all your Direct Loans at the time you enter repayment under the plan, including loans made before and after July 1, 2026. Interest is not part of the test. A balance of $49,999 gets 15 years and a balance of $50,000 gets 20, which lowers the payment noticeably for a single dollar of difference.' },
    { q: 'Can I pay more than the required amount without a penalty?', a: 'Yes. Federal law lets borrowers repay early without penalty on every plan. Extra money usually goes first to interest and then to principal; asking the servicer to apply it to principal and to keep the due date unchanged gives the largest saving. The payoff calculator measures the effect of a regular extra payment.' },
    { q: 'Does the 10-year plan still exist after the 2025 law?', a: `Yes, for borrowers who have no Direct Loan made on or after ${day(P.law.newPlansStart)}. Once you receive a new loan, all your Direct Loans move to the two-plan menu: Tiered Standard or RAP. The 10-year plan also remains the reference for PSLF: a payment at least equal to the 10-year amount always qualifies.` },
    { q: 'Why is my servicer’s payment a few dollars different?', a: 'Servicers compute each loan separately, use the exact interest rate of each disbursement, and may include interest that accrued during the grace period or a forbearance. This calculator treats your balance as one loan at one rate. Enter the weighted average rate shown on StudentAid.gov to get within a few dollars.' },
    { q: 'Is a longer term a bad idea?', a: `It costs more interest, not more risk. On ${usd(120000)} at ${pct(R.grad)}, the Tiered Standard plan asks ${usd(big.payment)} a month over ${big.years} years; the 10-year plan would ask ${usd(standard10(120000, R.grad))}. If your budget allows, you can pay the higher amount on the longer plan and keep the lower one as a safety net.` },
  ],
  body: (h) => `
<h2>Payments by balance and rate</h2>
<p>The table applies the two fixed plans to common balances at the 2026-27 rates: ${pct(R.undergrad)} for undergraduate loans and ${pct(R.grad)} for graduate unsubsidized loans. The Tiered Standard term changes with the balance, so the gap between the two plans grows with the debt.</p>
${h.table(['Balance', 'Rate', '10-year standard', 'Tiered Standard'], [row(15000, R.undergrad), row(27000, R.undergrad), row(45000, R.undergrad), row(60000, R.grad), row(100000, R.grad), row(180000, R.grad)], 'Monthly payments, one loan at one fixed rate.', ['l', 'r', 'r', 'r'])}
<h2>How the payment is computed</h2>
<p>A fixed plan uses the standard loan formula: the payment that brings the balance to zero after the last month, at the monthly rate (the yearly rate divided by 12). For ${usd(B)} at ${pct(R.undergrad)} over 120 months it gives ${usd(s10)}; over ${tier.months} months it gives ${usd(tier.payment)}. Over the full term you repay ${usd(s10 * 120)} on the first schedule and ${usd(tier.payment * tier.months)} on the second. The calculator also lets you pick your own term, which helps when you compare with a private loan or set a payoff goal, for example ${usd(amortized(B, R.undergrad, 84))} a month to finish in seven years.</p>
<h2>When a fixed plan beats an income-driven plan</h2>
<p>Fixed plans are simple and finish on a known date. They make sense when your income is comfortably above your payment and you do not expect forgiveness. With a modest income, the ${h.a('rap-calculator', 'Repayment Assistance Plan')} can ask much less and still lower the balance every month, and the ${h.a('home', 'plan comparator')} shows total cost under each plan with your income path. Public service workers should read ${h.a('public-service-loan-forgiveness', 'PSLF')} first: the Tiered Standard plan counts toward PSLF only when its payment reaches the 10-year amount, which is rarely the case for balances above ${usd(25000)}.</p>
<h2>Grace period, first bill and interest that came before</h2>
<p>A Direct Loan enters repayment six months after you leave school or drop below half time. Interest on unsubsidized loans runs during school and that grace period, so the balance on your first bill can be higher than the amount you borrowed. Enter the balance your servicer shows, not the original loan amount. If you consolidated or left a forbearance, the unpaid interest may already have been added to principal. The figure the Tiered Standard plan uses to set your term is principal only, which is why two borrowers with the same total owed can receive different terms.</p>
<p>Your rate is the one fixed when each loan was first disbursed: ${pct(R.undergrad)} for undergraduate loans first disbursed from ${day(R.from)}, ${pct(P.rates.history[1].undergrad)} the year before. A borrower with loans from several years should use the weighted average rate. The ${h.a('interest-rates', 'interest rate page')} lists every year since 2023.</p>
<h2>Which loans this applies to</h2>
<p>The calculator covers Direct Loans, including Direct PLUS loans. A parent PLUS loan made on or after ${day(P.law.newPlansStart)} must be repaid under the Tiered Standard plan (${h.src('obbba', 'HEA section 455(d)(7)(E)')}). For older loans, the extended and graduated plans of ${h.src('ecfr208', '34 CFR 685.208')} remain until you choose otherwise; they are not modeled here.</p>`,
  related: ['home', 'tiered-standard-repayment-plan', 'student-loan-payoff-calculator', 'rap-calculator', 'interest-rates', 'student-loan-interest-calculator'],
  sources: ['obbba', 'ecfr208', 'riseFinal', 'ratesNotice', 'edFactSheet'],
});
