import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, ym, day, payoff, standard10, tieredStandard, rapPayment } from '../../lib/kit';

const B = 30000; const pay = standard10(B, R.undergrad);
const base = payoff(B, R.undergrad, pay); const x100 = payoff(B, R.undergrad, pay, 100); const x250 = payoff(B, R.undergrad, pay, 250);
const G = 85000; const tier = tieredStandard(G, R.grad);
const gBase = payoff(G, R.grad, tier.payment); const gX = payoff(G, R.grad, tier.payment, 300);
const cut = R.undergrad - P.autopay.promoCut;

export default definePage({
  id: 'student-loan-payoff-calculator',
  group: 'repay',
  kind: 'pillar',
  order: 40,
  slug: 'student-loan-payoff-calculator',
  nav: 'Payoff calculator',
  card: 'How much time and interest an extra payment each month saves',
  title: 'Student Loan Payoff Calculator 2026: Extra Payments, Savings',
  description: `Student loan payoff calculator 2026: on ${usd(B)} at ${pct(R.undergrad)}, ${usd(100)} extra a month saves ${usd(base.interest - x100.interest)} of interest; see your new payoff date and when not to prepay.`,
  h1: 'Student loan payoff calculator',
  intro: 'Time and interest saved by paying more than the required amount, and the cases where prepaying is a mistake.',
  resume: `Adding ${usd(100)} a month to the ${usd(pay)} payment on a ${usd(B)} loan at ${pct(R.undergrad)} clears it in ${ym(x100.months)} instead of ten years and saves ${usd(base.interest - x100.interest)} of interest; ${usd(250)} extra brings it to ${ym(x250.months)} and saves ${usd(base.interest - x250.interest)}. Federal student loans can be prepaid at any time without penalty, and every extra dollar that reaches principal stops interest from running on it for the rest of the term. The saving is larger on graduate loans, which carry ${pct(R.grad)} for 2026-27, and on the long Tiered Standard terms of 15 to 25 years introduced on ${day(P.law.newPlansStart)}. Prepaying is not always wise, though. A borrower heading for Public Service Loan Forgiveness, or one whose balance will be forgiven on an income-driven plan, may simply hand money back that would have been canceled. On the Repayment Assistance Plan, paying ahead can also cost the monthly matching payment unless you keep your due date. The calculator shows the effect on any fixed-rate loan.`,
  tool: 'payoff',
  toolProps: { balance: B },
  faqs: [
    { q: 'Should I pay off my student loans early or invest the money?', a: `Paying a loan early earns a guaranteed return equal to its interest rate, ${pct(R.undergrad)} on a new undergraduate loan and ${pct(R.grad)} on a graduate one. An investment can earn more or less. Many borrowers first take an employer retirement match, keep an emergency fund, then prepay the loan with the highest rate. No calculator can choose for you; this one shows the guaranteed side.` },
    { q: 'How do I make sure extra money goes to principal?', a: 'Tell your servicer, online or in writing, to apply amounts above the required payment to principal and not to advance your next due date. Without that instruction the servicer may treat the extra as an early payment of future bills. Target the loan with the highest rate first if you have several.' },
    { q: 'Does prepaying lower my monthly payment?', a: 'Not on a fixed plan: the payment stays the same and the loan ends sooner. On an income-driven plan the payment depends on income, not balance, so prepaying does not lower it either; it only shortens the time until the balance reaches zero. A lower payment requires a different plan or a longer term.' },
    { q: 'Is it worth prepaying if I expect PSLF?', a: 'Usually not. PSLF forgives the remaining balance tax-free after 120 qualifying payments, so every extra dollar paid before then reduces the amount forgiven rather than your cost. Paying the required amount on time, on a qualifying plan, while working full time for a qualifying employer, is what counts.' },
    { q: 'Can I prepay on the Repayment Assistance Plan without losing the match?', a: `Yes, if you ask the servicer not to advance your due date. The regulation advances the due date by default when you overpay, and a month without a payment due earns no matching principal payment. With the opt-out, the extra goes to principal and the next month still has a due date, so the match of up to ${usd(P.rap.matchMax)} remains available.` },
    { q: 'What if my payment does not cover the interest?', a: 'On a fixed loan, the balance would never shrink and the calculator says so. On federal plans that cannot happen on the standard schedules, which are built to repay the loan, but it can on IBR, where unpaid interest accrues. On RAP, an on-time payment that falls short of the interest wipes the rest.' },
  ],
  body: (h) => `
<h2>Extra payments on a graduate balance</h2>
<p>Long terms make prepayment more powerful. ${usd(G)} of graduate loans at ${pct(R.grad)} falls in the 20-year tier of the Tiered Standard plan, with a payment of ${usd(tier.payment)}. Paying ${usd(300)} more each month ends the loan in ${ym(gX.months)} instead of ${ym(gBase.months)} and saves ${usd(gBase.interest - gX.interest)} of interest. The table compares a few extra amounts on that balance.</p>
${h.table(['Extra each month', 'Time to payoff', 'Total interest', 'Interest saved'], [0, 100, 300, 600, 1000].map((x) => { const r = payoff(G, R.grad, tier.payment, x); return [usd(x), ym(r.months), usd(r.interest), usd(gBase.interest - r.interest)]; }), `${usd(G)} at ${pct(R.grad)}, Tiered Standard payment of ${usd(tier.payment)}.`, ['l', 'r', 'r', 'r'])}
<h2>A lower rate does part of the work</h2>
<p>The Department offers a rate cut to borrowers who pay by automatic debit: ${pct(P.autopay.standardCut)} normally, and ${pct(P.autopay.promoCut)} in total for those enrolled by ${day(P.autopay.promoEnrollBy)}, kept until ${day(P.autopay.promoUntil)} (${h.src('edAutopayExtend', 'Department of Education, September 29, 2026')}). On the ${usd(B)} loan, going from ${pct(R.undergrad)} to ${pct(cut)} for the period of the offer lowers the interest you pay without any extra cash. Combined with an extra payment, it shortens the loan further. Details on the ${h.a('autopay-rate-reduction', 'auto pay rate reduction page')}.</p>
<h2>Lump sums: refunds, bonuses and gifts</h2>
<p>A one-time payment works like a run of extra monthly payments made all at once, and it starts saving interest immediately. A ${usd(3000)} tax refund applied to the ${usd(B)} loan in its first year removes roughly ${usd(3000 * R.undergrad / 100)} of interest in the following twelve months alone, and keeps saving every year after that because the principal never comes back. The order matters when you hold several loans: send the money to the one with the highest rate, which for most borrowers with recent loans means a graduate unsubsidized loan at ${pct(R.grad)} or a PLUS loan at ${pct(R.plus)}, before the undergraduate loans at ${pct(R.undergrad)}. The calculator handles one balance at a time, so run it on each loan separately if their rates differ.</p>
<h2>When paying faster costs you</h2>
<p>Three situations argue against prepaying. First, PSLF: the balance left after 120 payments is canceled, so prepaying reduces the gift, not your cost. Second, a long income-driven horizon with a large balance: if the ${h.a('home', 'plan comparator')} shows a forgiven amount on RAP or IBR, extra payments shrink it. Third, a cash cushion you would need to rebuild with a credit card at a higher rate. In other cases, prepaying a ${pct(R.grad)} loan is one of the few risk-free returns available.</p>
<h2>RAP borrowers: keep the due date</h2>
<p>On the Repayment Assistance Plan, the waiver of unpaid interest and the matching payment of up to ${usd(P.rap.matchMax)} depend on an on-time payment for each month with a due date. A borrower earning ${usd(60000)} with no dependent pays ${usd(rapPayment({ agi: 60000, dependents: 0 }).payment)} and may want to add more. The rule in ${h.src('ecfr209', '34 CFR 685.209(o)(3)')} lets you choose, for each payment, whether the excess advances the due date; choosing not to advance keeps the monthly benefits.</p>`,
  related: ['home', 'student-loan-payment-calculator', 'autopay-rate-reduction', 'rap-interest-waiver-and-match', 'student-loan-interest-calculator', 'student-loan-refinance-calculator'],
  sources: ['ecfr209', 'ecfr208', 'ratesNotice', 'edAutopayExtend'],
});
