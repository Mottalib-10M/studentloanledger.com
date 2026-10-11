import { definePage } from '../../lib/page-types';
import { P, usd, day, sai, businessAdjusted } from '../../lib/kit';

const S = P.sai;
const X = S.obbbaFarmBusinessExclusion;
const fmt = (n: number) => n.toLocaleString('en-US');
const T = S.businessNetWorth as Array<[number | null, number, number, number]>;
/** Married parents of a dependent student, household of four, $82,000 of AGI, tax paid 5% of AGI, $12,000 of savings (as in the mini). */
const base = { dependent: true, married: true, familySize: 4, filing: 'mfj' as const, parents: { agi: 82000, taxPaid: Math.round(82000 * 0.05), earned: 82000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 12000 };
const out = sai(base);
const rows = [120000, 260000, 650000, 1400000].map((nw) => ({ nw, adj: businessAdjusted(nw), r: sai({ ...base, businessNetWorth: nw }) }));
const ex = rows[1];
/** A farm couple with a lower cash income: $58,000 of AGI, household of five. */
const farmBase = { dependent: true, married: true, familySize: 5, filing: 'mfj' as const, parents: { agi: 58000, taxPaid: 1700, earned: 58000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 8000 };
const farmOut = sai(farmBase); const farmIn = sai({ ...farmBase, businessNetWorth: 900000 });

export default definePage({
  id: 'fafsa-business-farm',
  group: 'aid',
  kind: 'guide',
  order: 160,
  slug: 'fafsa-small-business-family-farm',
  nav: 'Business and farm on the FAFSA',
  card: 'From 2026-27 a family farm you live on and a family business with 100 or fewer employees leave the FAFSA',
  title: 'FAFSA Small Business and Family Farm Exclusion 2026-27',
  description: `FAFSA 2026-27: a family farm you live on and a family business with ${X.employeesMax} or fewer employees drop out of net worth; at ${usd(ex.nw)} the SAI drops ${fmt(ex.r.sai - out.sai)} points.`,
  h1: 'Small businesses and family farms on the FAFSA',
  intro: 'For 2026-27 a change in the 2025 budget law takes the family business and the family farm out of the asset questions, for most owners.',
  resume: `Starting with the 2026-27 FAFSA, the net worth of three kinds of family assets no longer counts toward the Student Aid Index: a family farm the family lives on, a small business with no more than ${X.employeesMax} full-time or full-time-equivalent employees that the family owns and controls, and a commercial fishing business, including its vessels and permits. Section 80001 of Public Law 119-21 made the change, effective ${day(X.from)}. Before it applied, net worth of a business or farm went through an adjustment table that counted 40% of the first ${usd(175000)} and up to 100% above ${usd(870000)}, and then ${S.parentAssetRate}% of the result flowed into the parents' side of the formula. For married parents of a household of four with ${usd(82000)} of AGI and a qualifying shop worth ${usd(ex.nw)}, the exclusion lowers the index from about ${fmt(ex.r.sai)} to ${fmt(out.sai)}. Businesses with more employees, farms the family does not live on and investment property still count. The simulator shows the difference for your own figures.`,
  mini: 'businessFarmSai',
  faqs: [
    { q: 'Do I have to report my small business on the 2026-27 FAFSA?', a: `Not if it qualifies. A business with ${X.employeesMax} or fewer full-time or full-time-equivalent employees that your family owns and controls is excluded from net worth from the 2026-27 award year, under section 80001 of the 2025 law. A larger business, or one the family owns without controlling, still goes on the form at its net worth: value minus debts secured by it.` },
    { q: 'Does a family farm count as an asset on the FAFSA now?', a: `Not when the family lives on it. From 2026-27 the law excludes a family farm on which the family resides. Farmland the family owns but does not live on, or a farm held only as an investment, is still reported, and its net worth passes through the business and farm table, which counts 40% of the first ${usd(175000)} and more above that.` },
    { q: 'What if my business has more than 100 employees?', a: `Then its net worth stays in the formula. The guide's adjustment table counts 40% up to ${usd(T[1][0] ?? 0)}, then ${usd(T[2][1])} plus 50% of the amount above that, then 60%, and 100% above ${usd(T[3][0] ?? 0)}. The adjusted figure is added to the parents' other assets, and ${S.parentAssetRate}% of the total feeds the index.` },
    { q: 'Are fishing boats and permits counted on the FAFSA?', a: 'Not for a commercial fishing business the family owns and controls. Section 80001 names a commercial fishing business and related expenses, including fishing vessels and permits, among the assets excluded from net worth from the 2026-27 award year. A boat kept for recreation is not a business asset and follows the ordinary rules for investments if it is reported at all.' },
  ],
  body: (h) => `
<h2>What the law took out of net worth</h2>
<p>The FAFSA already left out the family home. Section 80001 of the 2025 budget law extends that list. It amends section 480(f)(2) of the Higher Education Act so that net worth excludes, in addition to the principal residence, a family farm on which the family resides, a small business with not more than ${X.employeesMax} full-time or full-time-equivalent employees (or any part of such a business) that is owned and controlled by the family, and a commercial fishing business with its related expenses, including fishing vessels and permits (${h.src('obbba', 'Public Law 119-21, section 80001')}). The change applies from award year 2026-27 and to every later year.</p>
<p>The Federal Student Aid guide for 2026-27 was published before the law was signed, and it still carries the business and farm adjustment table. That table remains in use for assets the exclusion does not reach. A qualifying business or farm should add nothing to the formula, whatever the table would have produced. The ${h.src('saiGuide', 'FSA SAI and Pell Grant Eligibility Guide')} shows where the table plugs in: line 13 of Formula A for parents, with matching lines in Formulas B and C.</p>

<h2>How much a business used to add</h2>
<p>The adjustment table softens the value of a business before it is assessed, then the result joins savings and investments. Here is the same family of four with ${usd(82000)} of AGI and ${usd(12000)} of savings, with businesses of different sizes, first with the business excluded as the law now requires, then counted as the table would count it.</p>
${h.table(['Business net worth', 'Amount the table would add', 'SAI, excluded', 'SAI, counted', 'Pell, excluded / counted'], rows.map(({ nw, adj, r }) => [usd(nw), usd(adj), fmt(out.sai), fmt(r.sai), `${usd(out.pell)} / ${usd(r.pell)}`]), 'Married parents, household of four, tax paid about 5% of AGI, 2026-27 Formula A.', ['l', 'r', 'r', 'r', 'r'])}
<p>A business worth ${usd(120000)} would add ${usd(rows[0].adj)} to assets and move the index by ${fmt(rows[0].r.sai - out.sai)} points. At ${usd(650000)} the adjusted figure reaches ${usd(rows[2].adj)} and the index climbs past the point where Pell ends. For this family, the exclusion is the difference between a Pell Grant of ${usd(out.pell)} and none, which is why owners of qualifying businesses should make sure the value stays off the form.</p>

<h2>Farm families with land but modest income</h2>
<p>Farms show the effect most sharply, because land values are high while cash income can be low. Picture married parents with five people at home, ${usd(58000)} of AGI, ${usd(8000)} of savings, and a farm they live on with a net worth of ${usd(900000)}. Excluded, as the law now provides, their student's index is about ${fmt(farmOut.sai)} and the Pell Grant ${usd(farmOut.pell)}. If the farm were counted, the table would add ${usd(businessAdjusted(900000))} and the index would jump to about ${fmt(farmIn.sai)}, above the cut-off of ${fmt(P.pell.max * P.pell.highSaiMultiple)} at which the 2025 law removes Pell altogether.</p>
<p>The condition is residence. A farm the family lives on is excluded. A second farm the family does not live on, or acreage held as an investment, is not, and its net worth still goes through the table. A family that lives on one parcel and farms several should be ready to show the aid office which land it lives on and how the operation is organized.</p>

<h2>Testing whether your business qualifies</h2>
<p>Three conditions come from the text. Size: no more than ${X.employeesMax} full-time or full-time-equivalent employees. Ownership: the family owns the business, or a part of it. Control: the family controls it. A family that owns a minority share in a company it does not run fails the control test even if the company is small. A business with 140 employees fails the size test no matter who runs it. The law sets no dollar ceiling on the business's value: a qualifying business worth several million dollars is excluded just as a small one is.</p>
<p>Some cases are not settled by the statute alone, such as how part-time staff convert into full-time equivalents or how a family is defined when relatives share ownership. When the answer is unclear, ask the financial aid office of each college how it applies the rule and keep its reply. The Department may issue further guidance; until then, the text of the law is the reference.</p>

<h2>Cash in the business or cash at home</h2>
<p>The exclusion draws a line through a family's money. Value held inside a qualifying business, its equipment, inventory, receivables and the balance of its own bank account, sits outside the formula. The same dollars moved into a personal savings account become reportable assets, and ${S.parentAssetRate}% of them counts for parents. A family that pays itself a large distribution just before filing therefore raises its index, while one that leaves working capital in the business does not. Assets are measured on the day the form is filed, so timing matters.</p>
<p>Income is a different matter. Profit that passes through to the owners' tax return is part of AGI whether it is distributed or not, and AGI is the main driver of the index. The exclusion protects the value of the enterprise, not the earnings it produces. A shop owner with ${usd(150000)} of business profit on the return will still see a high index even with the shop itself left out.</p>
<p>Independent students who own a business are covered too. The amended definition of net worth applies to every formula, so a student who runs a small company or works a family farm and files as independent leaves the qualifying asset off as well. For them the stakes follow their own asset rates: Formula B adds ${S.indNoDepAssetRate}% of the other assets of an independent student without children straight to the index, and Formula C counts ${S.indDepAssetRate}% for a student with dependents before the assessment schedule applies.</p>

<h2>Reporting it on the form</h2>
<p>Net worth means what the business or farm is worth minus the debts owed on it. For 2026-27, follow the form's instructions for a business or farm that meets the exclusion, so that it adds nothing to the index. Other assets still go on the form as usual: cash, savings, checking, investments including real estate other than the home, and ${S.parentAssetRate}% of their total counts for parents. The ${h.a('sai-calculator', 'SAI calculator')} computes the index without a business line, which matches the result for qualifying owners; the simulator above adds the business back to show what the exclusion is worth. For a broader look at the 2026 changes to aid, see the ${h.a('pell-grant-changes', 'Pell changes page')} and the ${h.a('fafsa-calculator', 'FAFSA estimate')}.</p>`,
  related: ['sai-calculator', 'fafsa-calculator', 'pell-grant-changes', 'efc-calculator', 'pell-grant-eligibility'],
  sources: ['obbba', 'saiGuide', 'needAnalysis'],
});
