import { definePage } from '../../lib/page-types';
import { P, usd, usdx, sai, poverty, pellMin } from '../../lib/kit';

const S = P.sai;
const dep = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 85000, taxPaid: 6000, earned: 85000 }, student: { agi: 4000, taxPaid: 0, earned: 4000 }, assets: 15000, studentAssets: 1000 });
const indB = sai({ dependent: false, married: false, familySize: 1, filing: 'single', student: { agi: 32000, taxPaid: 1500, earned: 32000 }, assets: 3000 });
const indC = sai({ dependent: false, married: false, familySize: 3, singleParent: true, filing: 'single', student: { agi: 41000, taxPaid: 0, earned: 41000 }, assets: 2000 });
const low = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 52000, taxPaid: 1200, earned: 52000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 5000 });
const fmt = (n: number) => n.toLocaleString('en-US');

export default definePage({
  id: 'sai-calculator',
  group: 'aid',
  kind: 'pillar',
  order: 10,
  slug: 'sai-calculator',
  nav: 'SAI calculator',
  card: 'Student Aid Index 2026-27 with the official formulas, line by line, and the Pell estimate',
  title: 'SAI Calculator 2026-27: Student Aid Index, Line by Line',
  description: `SAI calculator 2026-27: your Student Aid Index from 2024 income and assets with the FSA formulas A, B and C, each line shown, and a Pell estimate up to ${usd(P.pell.max)}.`,
  h1: 'Student Aid Index calculator for 2026-27',
  intro: 'The number the FAFSA produces, computed with the formulas and tables Federal Student Aid published for 2026-27, so you can see where it comes from.',
  resume: `A dependent student whose married parents earned ${usd(85000)} in 2024, paid ${usd(6000)} of federal income tax, have ${usd(15000)} in savings and a household of four gets a 2026-27 Student Aid Index of about ${fmt(dep.sai)}, which corresponds to a Pell Grant of ${usd(dep.pell)} at full-time enrollment. The SAI replaced the Expected Family Contribution and is computed from the FAFSA with three formulas: Formula A for dependent students, B for independent students without dependents and C for independent students with dependents. Each starts from income in the prior-prior tax year, 2024 for the 2026-27 award year, subtracts allowances for taxes and living costs (${usd(S.ipaParent.base[2])} for a family of four), adds a share of net assets and runs the result through an assessment schedule of 22% to 47%. The index can be negative, down to ${fmt(S.floor)}. Colleges use it to award need-based aid: Pell Grant, subsidized loans, work-study and often their own grants. This calculator follows the Federal Student Aid guide line by line.`,
  tool: 'sai',
  faqs: [
    { q: 'What is a good SAI score for financial aid?', a: `The lower the better: at an SAI of 0 or less a student receives the maximum Pell Grant, ${usd(P.pell.max)} for 2026-27. Pell continues, shrinking, up to an SAI of ${fmt(Math.round(P.pell.max - pellMin))}. Beyond that, colleges still use the SAI to measure need for their own aid, subsidized loans and work-study, so a mid-range SAI still matters at expensive schools.` },
    { q: 'Which tax year does the 2026-27 FAFSA use?', a: 'The 2024 tax year, the prior-prior year, transferred from the IRS with your consent. Assets are reported as of the day the FAFSA is filed. The Pell Grant thresholds compare 2024 AGI with the 2024 HHS poverty guidelines, for example $15,060 for one person in the 48 states and DC.' },
    { q: 'Does the number of siblings in college lower the SAI?', a: 'No longer. The SAI formula that replaced the EFC has no adjustment for other family members in college, so each student’s index is computed as if alone. Some colleges still take siblings into account for their own aid, but federal aid does not.' },
    { q: 'How are parents’ assets counted in the SAI?', a: `Cash, savings, checking and the net worth of investments, including a 529 plan and real estate other than the home, plus child support received. In 2026-27 the asset protection allowance is ${usd(0)} at every age, so ${S.parentAssetRate}% of the total is added to available income. Retirement accounts and the home are not counted.` },
    { q: 'Why is my SAI negative?', a: `Because the allowances exceed the family's income. Negative values go down to ${fmt(S.floor)}, and families whose parents did not file a 2024 tax return are set at ${fmt(S.floor)}. A negative SAI means maximum Pell, and colleges may treat it as extra need when they award their own funds.` },
    { q: 'Is the SAI the amount my family must pay?', a: 'No. It is an index used to compare need, not a bill. Colleges compute need as cost of attendance minus SAI minus other aid, and few colleges meet all of it. The actual net price depends on each college’s grants, which is why its net price calculator matters.' },
    { q: 'Does the 2025 law change the SAI for 2026-27?', a: 'Two changes touch Pell rather than the SAI itself: foreign income now counts toward the AGI used for Pell, and a student whose SAI is at least twice the maximum Pell Grant cannot receive Pell. A third change excludes a family farm the family lives on and a family business with 100 or fewer employees from net worth.' },
  ],
  body: (h) => `
<h2>Formula A: a dependent student, step by step</h2>
<p>The calculator's breakdown for the family in the answer above reads like the FSA worksheet. Total parent income is AGI, here ${usd(85000)}, plus untaxed income and minus a few offsets. Allowances are subtracted: federal income tax paid, payroll taxes (${S.hi.rate}% Medicare and ${S.oasdi.rate}% Social Security on earnings), the income protection allowance of ${usd(S.ipaParent.base[2])} for four people and an employment expense allowance of 35% of earnings up to ${usd(S.eeaMax)}. What remains is available income. Then ${S.parentAssetRate}% of net assets is added, and the assessment schedule turns the total into the parents' contribution. The student's income counts at ${S.studentIncomeRate}% above an allowance of ${usd(S.ipaDependentStudent)}, and the student's own assets at ${S.studentAssetRateDep}%.</p>
${h.table(['Line', 'Amount'], dep.parts.map(([l, x]) => [l, x < 0 ? `minus ${usd(-x)}` : usd(x)]), `Dependent student, parents married, family of 4, 2024 income. SAI = ${fmt(dep.sai)}.`, ['l', 'r'])}
<h2>Formulas B and C for independent students</h2>
<p>An independent student's own income replaces the parents'. Without dependents (Formula B), the living allowance is ${usd(S.ipaIndNoDep.single)} for a single student and ${usd(S.ipaIndNoDep.married)} for a married one, available income counts at ${S.studentIncomeRate}% and assets at ${S.indNoDepAssetRate}%: a single student with ${usd(32000)} of income gets an SAI of ${fmt(indB.sai)}. With dependents (Formula C), the allowance is much larger, ${usd(S.ipaIndSingleDep.base[1])} for a single parent with two children, assets count at ${S.indDepAssetRate}%, and the same assessment schedule as for parents applies: a single parent of two earning ${usd(41000)} gets ${fmt(indC.sai)} and the maximum Pell. Who counts as independent is set by law: born before January 1, 2003 for 2026-27, married, a graduate student, a veteran, supporting a child, and a few other cases.</p>
<h2>When the formula is skipped</h2>
<p>Two shortcuts come before the formula. If the parents of a dependent student, or an independent student and spouse, did not file a 2024 federal return, the SAI is ${fmt(S.floor)}. If their 2024 AGI is at or below 175% of the poverty guideline for the family size, or 225% for a single parent, the student receives the maximum Pell and keeps an SAI of 0 or below: for a family of four in the 48 states the line is ${usd(Math.round(poverty(4, 'us', '2024') * 1.75))}. The family in the table with ${usd(52000)} of income is just under it and ends at ${fmt(low.sai)}.</p>
<h2>Limits of this estimate</h2>
<p>The form here leaves out untaxed income such as IRA deductions and tax-exempt interest, and offsets such as taxable grants and education credits, which most families do not have; enter them in AGI if they matter. It also leaves out business and farm net worth, which a family farm or small family business no longer adds from 2026-27 (${h.a('fafsa-business-farm', 'details')}). The official numbers are in the ${h.src('saiGuide', '2026-27 SAI and Pell Grant Eligibility Guide')} and the ${h.src('needAnalysis', 'Federal Register tables')}. Your FAFSA Submission Summary shows the official SAI; if it differs by more than rounding, look first at the tax paid and the family size.</p>`,
  related: ['pell-grant-calculator', 'fafsa-calculator', 'pell-grant-eligibility', 'negative-sai', 'efc-calculator', 'fafsa-business-farm'],
  sources: ['saiGuide', 'needAnalysis', 'frPoverty2024', 'approps', 'obbba'],
});
