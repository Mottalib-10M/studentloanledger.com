import { definePage } from '../../lib/page-types';
import { P, usd, sai, poverty } from '../../lib/kit';

const S = P.sai;
const fmt = (n: number) => n.toLocaleString('en-US');
const floor = fmt(S.floor);
/** Married parents of a dependent student, household of four, tax paid 2% of AGI, $4,000 of savings (same hypothesis as the mini). */
const dep = (agi: number) => sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi, taxPaid: Math.round(agi * 0.02), earned: agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 4000 });
const raw = (r: ReturnType<typeof sai>) => r.parts[4][1] + r.parts[5][1] + r.parts[6][1];
const grid = [44000, 48000, 52000, 57000].map((a) => ({ a, r: dep(a) }));
/** Independent student, single, no children, tax paid 3% of AGI, $1,000 of savings. */
const ind = (agi: number) => sai({ dependent: false, married: false, familySize: 1, filing: 'single', student: { agi, taxPaid: Math.round(agi * 0.03), earned: agi }, assets: 1000 });
const i18 = ind(18000); const i20 = ind(20000);
/** Single parent of a dependent student, household of three, $46,000: under the 225% line, formula positive. */
const sp = sai({ dependent: true, married: false, singleParent: true, familySize: 3, filing: 'single', parents: { agi: 46000, taxPaid: 920, earned: 46000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 4000 });
const line4 = Math.round((poverty(4, 'us', '2024') * P.pell.maxPellAgiPct.other) / 100);
const lowest = S.assessment[0][1] as number;

export default definePage({
  id: 'negative-sai',
  group: 'aid',
  kind: 'guide',
  order: 150,
  slug: 'negative-sai',
  nav: 'Negative SAI',
  card: 'What a Student Aid Index below zero means, how it is reached, and why it stops at -1,500',
  title: `Negative SAI 2026-27: What an Index Down to ${floor} Means`,
  description: `Negative SAI in 2026-27: an index from 0 down to ${floor} means the full ${usd(P.pell.max)} Pell Grant; how families reach it, why it stops at ${floor} and what colleges see.`,
  h1: 'Negative SAI: what an index below zero means',
  intro: 'A minus sign on the FAFSA Submission Summary is not an error. It is the formula saying a family cannot contribute, and by how much.',
  resume: `A negative Student Aid Index means the FAFSA formula found that a family's allowances for taxes and basic living costs exceed its income, so it has nothing to contribute toward college. For 2026-27 the index can run from 0 down to ${floor}, and anywhere in that range the student qualifies for the maximum Pell Grant of ${usd(P.pell.max)} for full-time study. Two routes lead below zero. Parents of a dependent student who did not file a 2024 federal return, or an independent student who did not, are placed at ${floor} directly. Families who filed reach a negative number through the formula: married parents of a household of four with ${usd(50000)} of AGI and ${usd(4000)} of savings land at about ${fmt(dep(50000).sai)}. The value below zero does not add money to the Pell Grant. It tells colleges how far a family sits under the point of contributing anything, which some of them use when they award their own grants. The checker shows your figure before and after the floor.`,
  mini: 'negativeSaiCheck',
  faqs: [
    { q: 'What does an SAI of -1500 mean?', a: `It is the lowest value the 2026-27 index can take. A student gets it either because the parents, or the independent student and spouse, did not file a ${S.taxYear} federal tax return, or because the formula produced a figure below ${floor} and was raised to the floor. In both cases the student qualifies for the full ${usd(P.pell.max)} Pell Grant.` },
    { q: 'Do I get more financial aid with a negative SAI?', a: `Not from Pell: the grant is ${usd(P.pell.max)} at any index from 0 down to ${floor}. The negative value is a signal to colleges, which see a family that cannot contribute at all and by how much. How a college uses that signal for its own grants is its policy, so ask the aid office whether it treats a negative index differently from zero.` },
    { q: 'Why is my SAI exactly 0 and not negative?', a: `Most likely your income was under the maximum-Pell line, ${usd(line4)} of AGI for a family of four, but the full formula still produced a positive number. In that case the guide holds the index at 0. It goes below zero only when the formula itself returns a negative figure, or when nobody in the household filed a ${S.taxYear} return.` },
    { q: 'Will my SAI stay negative next year?', a: `Not necessarily. The index is computed again for every award year from that year's tax return, two years back, and that year's tables. A raise, a second earner or savings built up before filing can move it above zero; for ${P.fafsa.nextYear} the form reads 2025 income. Families near the line should rerun an estimate each fall rather than assume the result carries over.` },
  ],
  body: (h) => `
<h2>Two roads below zero</h2>
<p>The first road is administrative. When the parents of a dependent student did not file a ${S.taxYear} federal return, the FSA guide assigns an index of ${floor}, calculates no family size and runs no formula. Both parents must be non-filers. The same applies to an independent student and, if married, the spouse. The result arrives with a maximum-Pell flag on the record the school receives, and nothing on the form can move it higher.</p>
<p>The second road runs through the arithmetic. The formula starts with income, subtracts federal income tax, payroll taxes, an income protection allowance (${usd(S.ipaParent.base[2])} for parents in a household of four) and an employment allowance, then adds ${S.parentAssetRate}% of assets. When the result is negative, the assessment schedule keeps the sign: 22% of a negative adjusted available income becomes a negative parents' contribution, never lower than ${usd(lowest)}. The student's own income and assets can only add to it, and if the sum falls below ${floor} the guide resets it to ${floor} (${h.src('saiGuide', 'FSA SAI and Pell Grant Eligibility Guide')}).</p>

<h2>Where filers land, income by income</h2>
<p>The table follows married parents of a household of four, no student income, tax paid of about 2% of AGI and ${usd(4000)} in savings. The column "before the floor" is the formula's own result; the index is what the FAFSA reports.</p>
${h.table(['Parents’ AGI', 'Formula result before the floor', 'SAI', 'Pell, full time'], grid.map(({ a, r }) => [usd(a), fmt(raw(r)), fmt(r.sai), usd(r.pell)]), `Formula A, 2026-27. Maximum-Pell AGI line for four people: ${usd(line4)}.`, ['l', 'r', 'r', 'r'])}
<p>At ${usd(44000)} the formula goes past the floor and the index is held at ${floor}. Between roughly ${usd(48000)} and ${usd(52000)} the family sits inside the negative band, each extra thousand dollars of income adding about two hundred points. At ${usd(57000)} the family is above the maximum-Pell line and the formula is positive, so the index is positive too and the grant starts to shrink. The band is narrow: about ${usd(57000 - 44000)} of extra AGI takes this family from the floor to a partial award.</p>

<h2>Independent students reach it faster</h2>
<p>An independent student without children follows a shorter formula. Available income above the allowance of ${usd(S.ipaIndNoDep.single)} for a single student counts at ${S.studentIncomeRate}%, and a shortfall counts at ${S.studentIncomeRate}% too, with the sign kept. A single student who earned ${usd(18000)} in ${S.taxYear} gets ${fmt(i18.sai)}; at ${usd(20000)} the figure is ${fmt(i20.sai)}, just under zero. Because half of every dollar moves the index, the band from 0 to ${floor} is crossed within a few thousand dollars of income. Independent students with children use the parents' assessment schedule, with larger allowances, so a single parent can earn considerably more and still sit below zero.</p>

<h2>Zero is not always a computed zero</h2>
<p>Many families see an index of exactly 0, and it often hides more than it shows. When AGI is at or under the maximum-Pell line, ${P.pell.maxPellAgiPct.other}% of the 2024 poverty guideline or ${P.pell.maxPellAgiPct.singleParent}% for a single parent, the guide sets the index to zero temporarily and then runs the formula. A negative result replaces the zero; a positive one is discarded and the zero stays. A single parent of a dependent student with ${usd(46000)} of AGI and a household of three is under her ${P.pell.maxPellAgiPct.singleParent}% line, so her index reads ${fmt(sp.sai)} and the grant is the full ${usd(sp.pell)}, even though the formula alone would have returned a positive figure.</p>
<p>So two students with an index of 0 can be in quite different positions. One may be a few dollars from a negative number; the other may have a formula result in the thousands that the income line overrode. If the income line is close, a raise in the base year can remove the protection and reveal the full positive index at once. The ${h.a('pell-grant-eligibility', 'Pell eligibility page')} lists the lines by family size.</p>

<h2>A working student in a family below zero</h2>
<p>Student earnings usually push the index up: a dependent student keeps ${usd(S.ipaDependentStudent)} after taxes and half of the rest is added. In a family below zero, the guide adds a second shield. Line 26 of Formula A, the allowance for parents' negative adjusted available income, takes the parents' shortfall and adds it to the student's own allowances. If the parents' adjusted available income is minus ${usd(9000)}, the student can earn ${usd(9000)} more than usual before any of it counts.</p>
<p>That matters for students who worked through high school or took a gap year. Without the shield, a summer job could erase the negative index of a family with very little income. With it, the student's earnings are first set against the family's shortfall. The mini-tool leaves student income out, so a student with sizable ${S.taxYear} earnings should run the full worksheet in the ${h.a('sai-calculator', 'SAI calculator')}, which applies the allowance line by line.</p>
<p>Student assets have no such protection. Savings in the student's own name count at ${S.studentAssetRateDep}% for a dependent student and are added after the parents' contribution, so ${usd(5000)} in a student account moves the index up by about ${fmt(Math.round(5000 * S.studentAssetRateDep / 100))} points, enough to lift a family from the middle of the negative band to near zero.</p>

<h2>What colleges do with a figure under zero</h2>
<p>For federal aid, the practical meaning is the maximum Pell Grant and the strongest possible starting point for need-based aid. Beyond that, the number is information. A college building an aid offer starts from its cost of attendance and the index; a school with its own grant money can use a negative figure to see which students have the greatest need and serve them first. Others treat every value below zero alike. There is no federal rule that turns ${floor} into ${usd(1500)} of extra aid, and an offer letter will not show a line for it.</p>
<p>Families in this band should still file early, because state and college grants often run out, and should check that family size and tax figures on the form are right: a household counted one person short or a tax payment left blank can push a negative index up to zero or beyond. The ${h.a('sai-calculator', 'SAI calculator')} shows every line of the worksheet, and the ${h.a('efc-calculator', 'EFC page')} explains why the old scale had no room below zero. Tables: ${h.src('needAnalysis', 'Federal Register 2025-10243')}.</p>`,
  related: ['sai-calculator', 'pell-grant-eligibility', 'efc-calculator', 'fafsa-calculator', 'pell-grant-calculator'],
  sources: ['saiGuide', 'needAnalysis', 'frPoverty2024'],
});
