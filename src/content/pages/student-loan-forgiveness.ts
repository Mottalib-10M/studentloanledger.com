import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, simulateRap, simulateIbr, rapPayment, pslfProjection } from '../../lib/kit';

const ex = { bal: 90000, agi: 48000, d: 1 };
const rap = simulateRap({ balance: ex.bal, rate: 6.8, agi: ex.agi, growth: 2, dependents: ex.d });
const ibr = simulateIbr({ balance: ex.bal, rate: 6.8, agi: ex.agi, growth: 2, familySize: 1 + ex.d, newBorrower: true });
const pslf = pslfProjection({ balance: ex.bal, rate: 6.8, payment: rapPayment({ agi: ex.agi, dependents: ex.d }).payment, madeSoFar: 0 });

export default definePage({
  id: 'student-loan-forgiveness',
  group: 'forgive',
  kind: 'pillar',
  order: 10,
  slug: 'student-loan-forgiveness',
  nav: 'Forgiveness calculator',
  card: 'Every federal forgiveness route open in 2026, with the amount and date for your loans',
  title: 'Student Loan Forgiveness 2026: Routes, Timeline, Calculator',
  description: `Student loan forgiveness in 2026: PSLF after ${P.pslf.payments} payments, RAP after ${P.rap.payments}, IBR after 20 or 25 years, disability discharge: how much could be forgiven, and when.`,
  h1: 'Student loan forgiveness in 2026: what exists, when it comes, how much',
  intro: 'The federal routes to forgiveness after the 2025 law, the end of SAVE and the new tax rule, computed for your own loans.',
  resume: `In 2026 federal student loan forgiveness comes through four doors: Public Service Loan Forgiveness after ${P.pslf.payments} qualifying payments in a public service job, the Repayment Assistance Plan after ${P.rap.payments} payments, Income-Based Repayment after ${P.ibr.newPayments / 12} or ${P.ibr.oldPayments / 12} years, and discharge for death or total and permanent disability. There is no broad cancellation program: the SAVE plan, which promised faster forgiveness for small balances, was closed by a court-approved settlement in March 2026, and its borrowers must move to another plan. For a borrower with ${usd(ex.bal)} of loans, a ${usd(ex.agi)} income and one child, PSLF would forgive about ${usd(pslf.forgiven)} after ten years on RAP; outside public service, RAP would ${rap.paidOff ? `repay the debt in ${Math.ceil(rap.months / 12)} years, leaving nothing to forgive` : `leave ${usd(rap.forgiven)} to forgive after ${P.rap.years} years`}, and IBR ${ibr.paidOff ? 'would repay it in full' : `would leave ${usd(ibr.forgiven)} after ${P.ibr.newPayments / 12} years`}. Taxes changed too: since January 1, 2026, only PSLF and death or disability discharges are clearly excluded from federal income.`,
  tool: 'forgive',
  toolProps: { balance: ex.bal, agi: ex.agi },
  faqs: [
    { q: 'Is there a new student loan forgiveness program in 2026?', a: `No new broad program. The 2025 law created the Repayment Assistance Plan, which forgives what is left after ${P.rap.payments} qualifying payments, and kept PSLF and IBR forgiveness. SAVE, with its shorter path for small balances, is closed. Beware of companies charging fees to enroll you in forgiveness: every federal plan is free through StudentAid.gov or your servicer.` },
    { q: 'How long does forgiveness take on each plan?', a: `PSLF: ${P.pslf.payments} qualifying payments, about ten years of full-time public service. IBR: ${P.ibr.newPayments} payments for borrowers with no balance before July 1, 2014, ${P.ibr.oldPayments} for earlier borrowers. RAP: ${P.rap.payments} payments. Some past payments and deferment months count toward these totals, so the remaining time can be shorter than the full term.` },
    { q: 'What happened to forgiveness under the SAVE plan?', a: 'SAVE closed. Under the settlement approved in March 2026, no one can enroll, pending applications were denied, and SAVE borrowers receive a 90-day notice from their servicer to choose another plan. Payments made under SAVE count toward IBR forgiveness as qualifying payments under the regulations, but SAVE’s own short forgiveness track no longer exists.' },
    { q: 'Will I owe taxes on forgiven student loans in 2026?', a: 'Possibly. PSLF forgiveness is tax-free under section 108(f)(1). The broad federal exclusion that covered other forgiveness from 2021 through 2025 was replaced on January 1, 2026 by a narrower rule covering death and total and permanent disability. Forgiveness after 20 to 30 years on IBR or RAP may therefore count as federal income.' },
    { q: 'Do parent PLUS loans qualify for forgiveness?', a: 'Parent PLUS loans qualify for PSLF only through a Direct Consolidation Loan on a qualifying plan, which for them means ICR until June 30, 2028, or IBR if the consolidation was repaid under ICR, PAYE or IBR at least once by then. They are discharged if the parent or the student dies, or the parent becomes totally and permanently disabled.' },
    { q: 'Does forgiveness happen automatically?', a: 'For income-driven plans, the regulation says the Department tracks progress and forgives loans that meet the criteria without an application. PSLF still requires employment certification and an application through StudentAid.gov. Keep your own count of qualifying payments and employer certifications in case of a dispute.' },
    { q: 'Is there forgiveness for teachers in 2026?', a: 'Teachers working full time for a public school or a nonprofit school can use PSLF like other public servants. Separate teacher programs exist in the law, but this site does not compute them and their amounts are not verified here. Check your eligibility with your servicer before counting on them.' },
  ],
  body: (h) => `
<h2>The routes side by side</h2>
${h.table(['Route', 'Who', 'When', 'Taxed federally?'], [['PSLF', 'Full-time employees of a government or qualifying nonprofit, Direct Loans', `${P.pslf.payments} qualifying payments`, 'No (108(f)(1))'], ['RAP', 'Direct Loans except parent PLUS', `${P.rap.payments} qualifying payments`, 'Possibly, since 2026'], ['IBR', 'Loans made before July 1, 2026', `${P.ibr.newPayments} or ${P.ibr.oldPayments} payments`, 'Possibly, since 2026'], ['Death or disability discharge', 'Any federal loan', 'On approval', 'No (108(f)(5))']], 'PAYE and ICR forgiveness continue only for their remaining borrowers until the plans end on June 30, 2028.', ['l', 'l', 'l', 'l'])}
<h2>Why the amount forgiven depends on your income path</h2>
<p>Income-driven forgiveness is what is left after decades of payments, and the payments follow income. A borrower whose income grows steadily may repay everything before the end, as RAP's interest waiver and principal match push the balance down each month. A borrower with a large balance relative to income will have more forgiven. The calculator above runs each route with the raise you expect; try a 0% and a 4% raise to see how sensitive your forgiveness is. The ${h.a('idr-forgiveness-timeline', 'forgiveness timeline page')} explains which past payments count.</p>
<h2>PSLF is the fastest route</h2>
<p>Ten years of full-time work, at least ${P.pslf.hoursPerWeek} hours a week, for a government employer or a qualifying nonprofit, and ${P.pslf.payments} payments on a qualifying plan: an income-driven plan, the 10-year standard plan, or any plan whose payment is at least the 10-year amount. RAP counts, by the 2025 law. From ${day(P.pslf.employerRuleFrom)}, organizations found to have a substantial illegal purpose are excluded as employers (${h.src('pslfRule', 'final rule of October 31, 2025')}). The ${h.a('pslf-calculator', 'PSLF calculator')} projects your remaining payments and the amount forgiven.</p>
<h2>What changed with the 2025 law</h2>
<p>Public Law 119-21 added RAP and its ${P.rap.years}-year horizon, made RAP payments count for PSLF, removed the partial financial hardship test from IBR, ended ICR and PAYE on ${day(P.law.oldPlansLastDay)}, and limited borrowers with new loans to RAP and Tiered Standard (${h.src('obbba', 'sections 82001 and 82004')}). The tax section rewrote the forgiveness exclusion, so the forgiveness date also becomes a tax planning date. ${h.a('forgiveness-taxes', 'Taxes on forgiveness')} shows the possible bill.</p>
<h2>Disability and death discharges</h2>
<p>A federal loan is canceled when the borrower dies, and a parent PLUS loan also when the student dies. A borrower who becomes totally and permanently disabled can have federal loans discharged after approval. Since ${day('2026-01-01')}, section 108(f)(5) of the tax code excludes those discharges from federal income permanently, for federal loans and for private education loans alike, provided the taxpayer's Social Security number appears on the return (${h.src('irc108', '26 U.S.C. 108(f)')}). This is the one part of the 2025 tax changes that protects borrowers rather than exposing them.</p>
<h2>Protecting your count</h2>
<p>Forgiveness counts are long and errors happen. Download your payment history from StudentAid.gov once a year, keep PSLF employment certifications, and check that months spent in a qualifying deferment were counted. Avoid gaps: a payment that arrives late can lose its qualifying status on RAP, and leaving public service for a few years pauses PSLF without erasing earlier payments. If a servicer's count looks wrong, write to them with your records before filing a complaint.</p>`,
  related: ['pslf-calculator', 'public-service-loan-forgiveness', 'idr-forgiveness-timeline', 'forgiveness-taxes', 'rap-calculator', 'save-plan-calculator'],
  sources: ['obbba', 'ecfr209', 'ecfr219', 'pslfRule', 'edSaveNextSteps', 'irc108'],
});
