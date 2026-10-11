import { definePage } from '../../lib/page-types';
import { P, usd, sai } from '../../lib/kit';

const S = P.sai;
const fmt = (n: number) => n.toLocaleString('en-US');
/** Married parents, household of five, $92,000 of AGI, tax paid 6% of AGI, $15,000 of savings (same hypothesis as the mini). */
const fam = sai({ dependent: true, married: true, familySize: 5, filing: 'mfj', parents: { agi: 92000, taxPaid: Math.round(92000 * 0.06), earned: 92000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 15000 });
/** A lower-income single parent of a dependent student, household of three. */
const low = sai({ dependent: true, married: false, singleParent: true, familySize: 3, filing: 'single', parents: { agi: 41000, taxPaid: 600, earned: 41000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 1500 });

export default definePage({
  id: 'efc-calculator',
  group: 'aid',
  kind: 'guide',
  order: 140,
  slug: 'efc-calculator',
  nav: 'EFC calculator',
  card: 'The Expected Family Contribution is gone: what replaced it, and how to read an old EFC today',
  title: 'EFC Calculator 2026-27: The EFC Is Now the Student Aid Index',
  description: `EFC calculator 2026-27: the Expected Family Contribution became the Student Aid Index in 2024-25; it now falls to ${S.floor.toLocaleString('en-US')} and ignores siblings in college.`,
  h1: 'EFC calculator: the Expected Family Contribution became the SAI',
  intro: 'If you are looking for your EFC, the number you need now has another name and a different formula. Here is how the two compare.',
  resume: `There is no Expected Family Contribution for 2026-27. The EFC was retired after the 2023-24 award year and replaced by the Student Aid Index starting with 2024-25, under the FAFSA Simplification Act. The SAI plays the same role, the figure colleges subtract from their cost of attendance to measure need, but it is built differently in two ways that change real results. It can be negative, down to ${fmt(S.floor)}, so the formula now separates a family with little income from one with none. And it no longer divides the parents' share among siblings in college: each student's index is computed as if no one else in the family were enrolled. A family with married parents earning ${usd(92000)}, five people at home and two children in college gets an index of about ${fmt(fam.sai)} for each student in 2026-27, and the two indexes add up to ${fmt(fam.sai * 2)}. Any "EFC calculator" still running the pre-2024 formula will give a 2026-27 answer that the FAFSA never produces.`,
  mini: 'saiSiblings',
  faqs: [
    { q: 'Is the SAI the same as the EFC?', a: `It does the same job but with a new formula. Both measure what the federal methodology expects a family can contribute, and colleges subtract either from their cost of attendance. The SAI, used since 2024-25, can go below zero to ${fmt(S.floor)}, ignores how many family members are in college and uses its own allowance tables, so the numbers are not interchangeable.` },
    { q: 'Where do I find my EFC on the FAFSA?', a: 'You will not find one for any year from 2024-25 on. The FAFSA Submission Summary shows the Student Aid Index in the place where the Student Aid Report used to print the EFC. If a college portal or a scholarship form still asks for an EFC, enter the SAI and say so; for current years they mean the same field.' },
    { q: 'Why did my aid drop with two kids in college?', a: `Because the old EFC split the parents' contribution among the children enrolled at the same time, and the SAI does not. A family that once saw each child's figure roughly halved when a second child started college now sees the full parents' share counted for each. Some colleges still adjust their own grants for siblings, but federal aid does not.` },
    { q: 'Should business owners compare an old EFC with the new SAI?', a: `Only with care. From 2026-27 the index leaves out a family farm the family lives on, a family-owned and controlled business with ${S.obbbaFarmBusinessExclusion.employeesMax} or fewer employees and a commercial fishing business, under section 80001 of the 2025 law. A figure computed in an earlier year under different asset rules can differ by thousands of points. Rerun the estimate with the current formula.` },
    { q: 'Can I still use an old EFC calculator for 2026-27?', a: `Not reliably. A tool built on the EFC formula uses older allowances and tables, applies a sibling divisor and stops at zero. The 2026-27 index uses the ${S.taxYear} tax year, the Federal Register tables of June 2025 and a floor of ${fmt(S.floor)}. Make sure any estimator you use says Student Aid Index and names the 2026-27 award year.` },
  ],
  body: (h) => `
<h2>Same seat at the table, new formula</h2>
<p>For decades, the FAFSA produced an Expected Family Contribution, and parents read the name literally: a bill. It never was one. It was an index for comparing need, and colleges used it as the starting point for their offers. The FAFSA Simplification Act kept that role and changed almost everything else. From the 2024-25 award year the result has been called the Student Aid Index, and the 2026-27 version follows the formulas and tables in the ${h.src('saiGuide', 'FSA SAI and Pell Grant Eligibility Guide')}.</p>
<p>The new name is more honest, and the formula behind it was rebuilt. In 2026-27, parents in a household of four shelter ${usd(S.ipaParent.base[2])}, and a dependent student ${usd(S.ipaDependentStudent)} of earnings. The asset protection allowance is ${usd(0)} at every age, so ${S.parentAssetRate}% of reportable parent assets is counted from the first dollar. Federal Pell Grant eligibility is now tied directly to income lines based on the poverty guideline, so many families learn their Pell result before the index is even computed. The ${h.a('sai-calculator', 'SAI calculator')} reproduces the current worksheet line by line.</p>

<h2>The sibling divisor is gone</h2>
<p>The change that surprises the most families is the end of the number-in-college adjustment. Under the EFC, a family with two children in college at once saw the parents' contribution divided between them, so each child's figure dropped sharply when a brother or sister enrolled. The SAI formula has no such step. The parents' contribution is computed once and counted in full in each child's index.</p>
${h.table(['Children in college at once', 'SAI for each student', 'Sum of the indexes', 'Pell for each, full time'], [1, 2, 3].map((k) => [String(k), fmt(fam.sai), fmt(fam.sai * k), usd(fam.pell)]), `Married parents, household of five, ${usd(92000)} of AGI, tax paid about 6% of AGI, ${usd(15000)} of savings. 2026-27 Formula A.`, ['l', 'r', 'r', 'r'])}
<p>The index stays the same whether one child or three are enrolled, so the family's combined measure of ability to pay grows with each new student. For a family near the Pell cut-off, that can be the difference between two grants and none. Colleges remain free to recognize siblings in their own aid, and some do, which is one more reason to read each school's offer and its policy rather than assume. The mini-calculator above shows the per-student index and the combined total for your household.</p>

<h2>A floor below zero</h2>
<p>Where the old figure bottomed out at zero, the SAI continues to ${fmt(S.floor)}. Two routes lead there. A family that did not file a ${S.taxYear} federal return is assigned ${fmt(S.floor)} outright. A family that filed with very low income can reach a negative number through the formula itself, because a negative parents' available income produces a negative contribution. A single parent with ${usd(41000)} of AGI and a household of three, for instance, lands at ${fmt(low.sai)}.</p>
<p>For Pell, anything at or below zero means the maximum award. Below zero, the figure is extra information for colleges about how far a family sits from being able to contribute at all. The ${h.a('negative-sai', 'negative SAI page')} explains what the range from 0 to ${fmt(S.floor)} does and does not change.</p>
<p>The floor also changes how families at the bottom compare with each other. Under a scale that stopped at zero, a household with a modest income and one with almost none looked identical on paper. With room below zero, the index keeps sorting them, and a college that wants to direct its own grants to the families with the least can see the difference. Whether it does so is the college's choice; the federal Pell award is the same at any figure from zero down.</p>

<h2>Business and farm owners: check which year a figure came from</h2>
<p>The 2026-27 index brings one more change that makes older figures hard to compare. Section 80001 of the 2025 budget law removes three assets from net worth from this award year on: a family farm the family lives on, a small business with no more than ${S.obbbaFarmBusinessExclusion.employeesMax} full-time or full-time-equivalent employees that the family owns and controls, and a commercial fishing business (${h.src('obbba', 'Public Law 119-21, section 80001')}). Other business and farm net worth still passes through the guide's adjustment table, which counts 40% of the first ${usd(175000)} and rises to 100% of the amount above ${usd(870000)}.</p>
<p>For a family with a qualifying shop or farm, the difference is large. A net worth of ${usd(300000)} run through that table would add ${usd(P.sai.businessNetWorth[2][1] + Math.round((300000 - P.sai.businessNetWorth[2][2]) * P.sai.businessNetWorth[2][3] / 100))} to the assets assessed; excluded, it adds nothing. So an index or an EFC computed in another year, under whatever rule applied then, says little about what the 2026-27 form will show. The ${h.a('fafsa-business-farm', 'business and farm page')} shows the effect on your own figures.</p>

<h2>Reading an old EFC today</h2>
<p>Old figures still circulate. An older child's Student Aid Report, a college's published average EFC from years past, a planning spreadsheet or a scholarship form may all quote one. None of them converts neatly. The same family can see a different SAI than its last EFC simply because the allowances moved, the sibling divisor vanished and assets are now counted without protection. A family with savings and two children close in age will usually see a higher figure per child, because nothing is divided any more; a family with very low income can now see a figure below zero.</p>
<p>When comparing aid over time, compare like with like. Last year's offer was built on last year's index and the cost of attendance for that year. If you are planning for a younger child, rerun the estimate with the current formula rather than scaling an old EFC. College websites that still publish an "average EFC" of admitted students are describing a measure that no longer exists, and the comparison with your current index will be loose at best.</p>

<h2>Getting today's number</h2>
<p>To estimate the index that replaced your EFC, collect the ${S.taxYear} federal returns for the parents of a dependent student, or for yourself and a spouse if independent, the balances of savings and investment accounts on the day you file, and the household size. Run them through the ${h.a('sai-calculator', 'full SAI calculator')} for a line-by-line result, or the ${h.a('fafsa-calculator', 'quick FAFSA estimate')} for a first look. Then turn the index into a grant with the ${h.a('pell-grant-calculator', 'Pell Grant calculator')}. The tables come from the ${h.src('needAnalysis', 'Federal Need Analysis Methodology for 2026-27')}; the official figure is the one on your FAFSA Submission Summary.</p>`,
  related: ['sai-calculator', 'fafsa-calculator', 'negative-sai', 'pell-grant-calculator', 'net-price-calculator'],
  sources: ['saiGuide', 'needAnalysis', 'frPoverty2024'],
});
