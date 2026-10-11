import { definePage } from '../../lib/page-types';
import { P, R, usd, pct, day, ibrPayment, ibrLine, rapPayment, standard10, poverty } from '../../lib/kit';

const A = 55000;
const nw = ibrPayment({ agi: A, familySize: 1, newBorrower: true, balance: 45000, rate: 6.5 });
const old = ibrPayment({ agi: A, familySize: 1, newBorrower: false, balance: 45000, rate: 6.5 });
const fam = ibrPayment({ agi: 70000, familySize: 4, newBorrower: true, balance: 60000, rate: 6.5 });
const lineRow = (n: number) => [String(n), usd(ibrLine(n)), usd(ibrLine(n, 'ak')), usd(ibrLine(n, 'hi'))];

export default definePage({
  id: 'ibr-calculator',
  group: 'repay',
  kind: 'pillar',
  order: 30,
  slug: 'ibr-calculator',
  nav: 'IBR calculator',
  card: 'Income-Based Repayment payment after the 2025 law, cap, forgiveness date and comparison with RAP',
  title: 'IBR Calculator 2026: Income-Based Repayment After the Law',
  description: `IBR calculator 2026: ${P.ibr.newPct}% or ${P.ibr.oldPct}% of income above ${usd(ibrLine(1))} for one person, capped at the 10-year payment, forgiveness after 20 or 25 years, compared with RAP.`,
  h1: 'Income-Based Repayment calculator',
  intro: 'The older income-driven plan that survives the 2025 law, for loans made before July 1, 2026.',
  resume: `With ${usd(A)} of adjusted gross income and a household of one, Income-Based Repayment costs ${usd(nw.payment)} a month for a borrower who had no federal loan balance before July 1, 2014, and ${usd(old.payment)} for an earlier borrower. IBR charges ${P.ibr.newPct}% or ${P.ibr.oldPct}% of the income above 150% of the poverty guideline, ${usd(ibrLine(1))} for one person in 2026, and never more than the 10-year standard payment fixed when you join. The 2025 law kept IBR but changed who can use it. It dropped the old entry test, the partial financial hardship, so any borrower with eligible loans can enroll. It also closed the plan to loans made from ${day(P.law.newPlansStart)}: a borrower who takes a new Direct Loan moves to the Repayment Assistance Plan or the Tiered Standard plan for everything. Forgiveness comes after ${P.ibr.newPayments / 12} years of payments for newer borrowers and ${P.ibr.oldPayments / 12} for the others, while unpaid interest keeps accruing in the meantime.`,
  tool: 'ibr',
  toolProps: { agi: A },
  faqs: [
    { q: 'What counts as family size for IBR?', a: 'You, your spouse if you file a joint return, your children if you provide more than half their support, including a child to be born during the year, and other people who live with you and receive more than half their support from you. The Department can take the number from your federal tax information. Each extra person raises the protected income line.' },
    { q: 'Do I still need a partial financial hardship to join IBR?', a: `No. Public Law 119-21 removed that condition on ${day(P.law.enacted)}, for borrowers already in repayment and new ones alike. Any borrower whose Direct Loans were all made before ${day(P.law.newPlansStart)} can choose IBR. If the formula gives more than the 10-year standard payment, you pay the 10-year amount instead.` },
    { q: 'Is the IBR payment ever zero?', a: `Yes. When income is at or below 150% of the poverty guideline, the payment is ${usd(0)}, and a computed payment under ${usd(P.ibr.zeroBelow)} is also set to zero. Between ${usd(P.ibr.zeroBelow)} and ${usd(P.ibr.tenBelow)} it is rounded up to ${usd(P.ibr.tenBelow)}. Months with a ${usd(0)} payment count toward IBR forgiveness.` },
    { q: 'Am I a new borrower for IBR?', a: 'You are a new borrower if you had no outstanding Direct or FFEL loan balance when you received a loan after July 1, 2014, and you have no loan made on or after July 1, 2026. New borrowers pay 10% and are forgiven after 20 years; others pay 15% and wait 25 years.' },
    { q: 'Can parent PLUS loans be repaid on IBR?', a: 'Not directly. Parent PLUS loans and consolidations that repaid them are excluded, unless the consolidation loan was repaid under ICR, PAYE or IBR at least once between July 4, 2025 and June 30, 2028. That route, explained on the parent PLUS repayment page, is how a parent keeps access to an income-driven plan.' },
    { q: 'What poverty guideline does IBR use in Alaska and Hawaii?', a: `Their own, which are higher: ${usd(poverty(1, 'ak'))} for one person in Alaska and ${usd(poverty(1, 'hi'))} in Hawaii in 2026, against ${usd(poverty(1))} in the 48 states and DC. A borrower living outside the states named by HHS uses the 48-state figure, so a move to Alaska or Hawaii lowers the IBR payment.` },
  ],
  body: (h) => `
<h2>The income line by family size</h2>
<p>IBR protects 150% of the HHS poverty guideline. The table gives that line for 2026; only income above it is charged.</p>
${h.table(['Family size', '48 states and DC', 'Alaska', 'Hawaii'], [1, 2, 3, 4, 5, 6].map(lineRow), 'Yearly amounts, 150% of the 2026 HHS poverty guidelines.', ['l', 'r', 'r', 'r'])}
<h2>A family example</h2>
<p>Take a household of four with ${usd(70000)} of AGI, ${usd(60000)} of loans at 6.5% and a borrower who first borrowed in 2016. The line is ${usd(ibrLine(4))}, the income above it ${usd(Math.max(0, 70000 - ibrLine(4)))}, and 10% of that divided by 12 gives ${usd(fam.payment)} a month. The same household on RAP, with the two children claimed as dependents, would pay ${usd(rapPayment({ agi: 70000, dependents: 2 }).payment)}. Family size and dependents are not the same test: IBR counts a spouse on a joint return as part of the family, while a spouse is never a dependent for RAP. The spouse's own federal loans also matter. On a joint return both plans add the incomes and then split the payment between the two borrowers in proportion to their eligible balances, so a couple where both owe can end up with two modest payments rather than one large one.</p>
<h2>The cap and why it matters</h2>
<p>The formula payment is compared with what you would have paid on a 10-year standard plan based on the eligible balance when you started IBR, here ${usd(standard10(45000, 6.5))} for ${usd(45000)} at 6.5%. If your income grows enough to exceed it, you pay the cap and your repayment can run longer than 10 years. Leaving IBR, or hitting the cap, capitalizes unpaid interest (${h.src('ecfr209', '34 CFR 685.209(j)(2)')}).</p>
<h2>Interest on IBR</h2>
<p>When your payment is below the month's interest, the remainder accrues. The regulation spares borrowers only the unpaid interest on subsidized loans for the first three consecutive years on the plan; the calculator does not model that benefit, so its projection is slightly conservative for borrowers with subsidized loans. The difference from RAP is real: under RAP an on-time payment wipes the interest it does not cover. The ${h.a('rap-vs-ibr', 'RAP vs IBR')} page compares the two side by side.</p>
<h2>Recertifying each year</h2>
<p>Your IBR payment is fixed for 12 months, then recalculated from your latest tax data. With consent for the Department to obtain your federal tax information, the update happens without a form. If the Department cannot obtain the information and you do not send it by the end of the period, the payment reverts to the capped amount, the 10-year standard payment fixed at entry, until you provide it. A drop in income during the year is a reason to ask for an early recalculation, with alternative documentation of income.</p>
<h2>Who should look at IBR first</h2>
<p>Low incomes. Because IBR ignores the first ${usd(ibrLine(1))} of a single borrower's income, someone earning ${usd(28000)} pays ${usd(ibrPayment({ agi: 28000, familySize: 1, newBorrower: true, balance: 30000, rate: 6.5 }).payment)} on IBR against ${usd(rapPayment({ agi: 28000, dependents: 0 }).payment)} on RAP. Borrowers aiming for ${h.a('public-service-loan-forgiveness', 'PSLF')} with a low income gain the most. Borrowers on PAYE or ICR must leave those plans by ${day(P.law.oldPlansLastDay)}, and IBR is one of the plans they may choose (${h.src('obbba', 'Public Law 119-21, section 82001(a)')}).</p>`,
  related: ['home', 'rap-vs-ibr', 'rap-calculator', 'income-driven-repayment-plans', 'repayment-plan-deadline', 'idr-forgiveness-timeline'],
  sources: ['obbba', 'ecfr209', 'riseFinal', 'hhs2026'],
});
