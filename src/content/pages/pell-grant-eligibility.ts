import { definePage } from '../../lib/page-types';
import { P, usd, usdx, sai, poverty, pellMin } from '../../lib/kit';

const pm = P.pell;
const mx = pm.maxPellAgiPct; const mn = pm.minPellAgiPct;
const fmt = (n: number) => n.toLocaleString('en-US');
const line = (pct: number, n: number, area: 'us' | 'ak' | 'hi' = 'us') => Math.round((poverty(n, area, '2024') * pct) / 100);
const cap = pm.max * pm.highSaiMultiple;
const cut = Math.round(pm.max - pellMin);
/** A single mother of two (household of three) with $52,000 of AGI, under the 225% line. */
const solo = sai({ dependent: false, married: false, singleParent: true, familySize: 3, filing: 'single', student: { agi: 52000, taxPaid: 900, earned: 52000 }, assets: 2500 });
/** Married parents of a dependent student, household of five, $70,000 of AGI. */
const five = sai({ dependent: true, married: true, familySize: 5, filing: 'mfj', parents: { agi: 70000, taxPaid: 2600, earned: 70000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 6000 });

export default definePage({
  id: 'pell-grant-eligibility',
  group: 'aid',
  kind: 'guide',
  order: 110,
  slug: 'pell-grant-eligibility',
  nav: 'Pell eligibility',
  card: 'Who qualifies for a Pell Grant in 2026-27: the income lines by family size, non-filers and the SAI cut-off',
  title: 'Pell Grant Eligibility 2026-27: Income Lines by Family Size',
  description: `Pell Grant eligibility 2026-27: a family of four under ${usd(line(mx.other, 4))} of 2024 AGI gets the full award; each income line, the non-filer rule and the SAI cut-off.`,
  h1: 'Who is eligible for a Pell Grant in 2026-27',
  intro: 'Eligibility comes down to a handful of gates: the kind of student you are, the income on a 2024 tax return compared with a poverty line, and the Student Aid Index.',
  resume: `A student is eligible for a 2026-27 Pell Grant when three things line up: undergraduate study toward a first bachelor's degree or a certificate, a FAFSA on file, and family finances under one of the federal lines. The simplest line decides the full ${usd(pm.max)}: ${mx.other}% of the 2024 poverty guideline, ${usd(line(mx.other, 4))} of adjusted gross income for a family of four in the 48 states and DC, or ${mx.singleParent}% for a single parent, ${usd(line(mx.singleParent, 3))} for a household of three. Parents who did not file a 2024 return at all, or an independent student who did not, also unlock the full award. Families above those lines qualify through the Student Aid Index, which must stay at or under ${fmt(cut)} for a sliding award, or reach the minimum award of ${usdx(pellMin)} if income is under a second, higher line. A new limit applies from July 1, 2026: an index of ${fmt(cap)} or more rules Pell out completely. The mini-tool shows the lines for your family size and state.`,
  mini: 'pellLines',
  faqs: [
    { q: 'Who qualifies for a Pell Grant in 2026-27?', a: `Undergraduates without a bachelor's degree whose families fall under the federal lines. The full ${usd(pm.max)} goes automatically to non-filers and to families with 2024 AGI at or under ${mx.other}% of the poverty guideline, or ${mx.singleParent}% for single parents. Above that, a Student Aid Index of ${fmt(cut)} or less gives a partial award, and the minimum lines catch some students beyond it.` },
    { q: 'Can I get a Pell Grant if my parents did not file taxes?', a: `Yes. When the parents of a dependent student did not file a 2024 federal return, the FSA guide assigns the student an index of ${fmt(P.sai.floor)} and the maximum Pell Grant, without running the formula. Both parents must qualify as non-filers for that rule. The same holds for an independent student, and spouse if married, who did not file.` },
    { q: 'Am I eligible for Pell if I already have a bachelor’s degree?', a: 'In general no. The statute limits Pell to the period needed for a first undergraduate baccalaureate course of study, so a second bachelor’s does not qualify. The Secretary may make case-by-case exceptions for some postbaccalaureate teacher certification programs carried at least half time. Lifetime use is capped at the equivalent of 12 full-time semesters.' },
    { q: 'Do the Pell income lines use gross income or AGI?', a: `Adjusted gross income from the 2024 federal return, plus any foreign income excluded from U.S. tax, which the 2025 law now adds for Pell purposes. Gross wages before retirement contributions and other adjustments are not the test. For a family of four the full-award line is ${usd(line(mx.other, 4))} of that figure, and the minimum-award line ${usd(line(mn.depOther, 4))}.` },
    { q: 'Why is the Pell line higher in Alaska and Hawaii?', a: `Because HHS publishes separate, higher poverty guidelines for both states, and the FSA guide applies the one for your state of legal residence. In 2024 the base was ${usd(P.fpl['2024'].ak[0])} for one person in Alaska and ${usd(P.fpl['2024'].hi[0])} in Hawaii, so a family of four in Alaska keeps the full award up to ${usd(line(mx.other, 4, 'ak'))} of AGI.` },
  ],
  body: (h) => `
<h2>The gates before any number is checked</h2>
<p>Income is the part everyone asks about, yet a student can fail Pell before income is looked at. The grant is for undergraduates: the law limits it to the time needed to finish a first bachelor's degree, and a student who already holds one is generally out. A certificate program at an eligible school counts as undergraduate study, and short programs of 8 to 14 weeks now have their own route through ${h.a('workforce-pell', 'Workforce Pell')}. The student must also file the FAFSA, because Pell is decided only from the results the Department sends back after processing.</p>
<p>Time is a gate too. Lifetime Pell use is capped at the equivalent of 12 full-time semesters (${h.src('hea401', '20 U.S.C. 1070a(d)')}), and each year of full-time Pell uses one sixth of that. A student returning after a long break should check how much of the allowance is left before counting on another year of grants.</p>

<h2>The income lines, family size by family size</h2>
<p>The FSA guide sets eligibility with percentages of the poverty guideline. For 2026-27 it uses the ${P.sai.taxYear} guidelines, ${usd(P.fpl['2024'].us[0])} for the first person and ${usd(P.fpl['2024'].us[1])} for each additional person in the 48 states and DC, and compares them with ${P.sai.taxYear} AGI. Each threshold is rounded to the nearest dollar before the comparison.</p>
${h.table(['Family size', `Full award, ${mx.other}%`, `Full award, single parent, ${mx.singleParent}%`, `Minimum award, dependent, ${mn.depOther}%`, `Minimum award, dependent, single parent, ${mn.depSingleParent}%`], [2, 3, 4, 5, 6].map((n) => [String(n), usd(line(mx.other, n)), usd(line(mx.singleParent, n)), usd(line(mn.depOther, n)), usd(line(mn.depSingleParent, n))]), '2024 AGI thresholds for 2026-27, 48 states and DC. Independent students: minimum-award lines of 400% (single parent), 350% (other parent) and 275% (no child).', ['l', 'r', 'r', 'r', 'r'])}
<p>Family size means the people counted on the FAFSA: for a dependent student, the student, the parents and the others they support; for an independent student, the student, a spouse and their dependents. One more person moves every line up by ${usd(Math.round(P.fpl['2024'].us[1] * mx.other / 100))} at the ${mx.other}% level, which is why an accurate household count is worth more than any other single answer on the form.</p>

<h2>Two shortcuts to the full award</h2>
<p>The first shortcut is filing status. When the parents of a dependent student did not file a ${P.sai.taxYear} federal return, the guide sets the index at ${fmt(P.sai.floor)}, skips the formula and returns the maximum Pell. Both parents must be non-filers. The same rule applies to an independent student and, if married, the spouse. A family that was not required to file and did not is treated differently from a family that filed with a small income, even if their earnings were similar.</p>
<p>The second shortcut is the income line. A filer whose AGI is above zero and at or under the line for the household receives the maximum Pell, and the index is held at zero or below. Take a single mother of two with ${usd(52000)} of AGI: her line at ${mx.singleParent}% for three people is ${usd(line(mx.singleParent, 3))}, so she qualifies for the full ${usd(solo.pell)} as an independent student, with an index of ${fmt(solo.sai)}. Who counts as a single parent follows the guide's appendix: an unmarried filer using head of household status, or a filer who claimed the earned income tax credit, among other cases.</p>

<h2>Above the lines: the index decides</h2>
<p>A family over the full-award line still has two paths. If the index is no higher than the maximum Pell minus the minimum award, ${fmt(cut)} this year, the award equals ${usd(pm.max)} minus the index. Married parents of five with ${usd(70000)} of AGI sit above their full-award line of ${usd(line(mx.other, 5))}; their index comes to ${fmt(five.sai)} and the student's grant to about ${usd(five.pell)}. The ${h.a('pell-grant-calculator', 'Pell Grant calculator')} runs that step for any household.</p>
<p>If the index is higher, the minimum award of ${usdx(pellMin)} remains possible for a family whose AGI is under the minimum-award line for its situation. That safety net now has a ceiling. Since July 1, 2026, a student whose index reaches twice the maximum Pell, ${fmt(cap)} for 2026-27, cannot receive any Pell Grant that year, even with income under a minimum line. The rule is most likely to reach families with large assets relative to their income, because assets push the index up without touching AGI. The ${h.a('pell-grant-changes', '2026 Pell changes')} page covers that rule and the others the 2025 law added.</p>

<h2>Checking your own case in four steps</h2>
<p>Start with the return. Find line 11 of the ${P.sai.taxYear} Form 1040 for the parents of a dependent student, or for yourself and a spouse if you are independent, and add any foreign earned income you excluded. If nobody in that group filed, stop there: the award is the maximum.</p>
<p>Next, count the household the way the FAFSA does and pick your situation in the mini-tool: dependent with two parents, dependent with a single parent, or one of the three independent cases. Compare your AGI with the first line it shows. At or under it, the answer is the full ${usd(pm.max)} for full-time study, and the work is done.</p>
<p>Above the first line, estimate the index. A rough figure is enough to tell which zone you are in: zero to ${fmt(cut)} means a sliding award, ${fmt(cut + 1)} to ${fmt(cap - 1)} means the minimum award only if AGI is under the second line, and ${fmt(cap)} or more means no Pell this year. Independent students without children face the tightest second line, ${mn.indNoChild}% of poverty, ${usd(line(mn.indNoChild, 1))} for one person, while an independent single parent of two can earn up to ${usd(line(mn.indSingleParent, 3))} and still reach the minimum.</p>
<p>Last, check the conditions that sit outside the formula: a first bachelor's degree not yet earned, semesters left in the lifetime allowance, and outside grants that stay below the cost of attendance. A student who clears all four steps should see a Pell line on every offer from an eligible school.</p>

<h2>Details that shift your line</h2>
<p>State of legal residence matters because Alaska and Hawaii have their own guidelines. A family of four in Hawaii keeps the full award up to ${usd(line(mx.other, 4, 'hi'))} of AGI, against ${usd(line(mx.other, 4))} in the 48 states. U.S. territories and addresses abroad use the 48-state figures.</p>
<p>Foreign income now counts. For Pell determinations from the 2026-27 year, foreign income excluded from U.S. tax is added to AGI before the comparison with the lines (${h.src('obbba', 'Public Law 119-21, section 83001')}). A family living abroad that reported little U.S. AGI could find itself above a line it used to clear.</p>
<p>Finally, eligibility is not the same as the money that arrives. The figures here describe a full-time, full-year award. A school pays less for part-time enrollment, and no Pell is paid for a period in which state, school and private grants already reach the full cost of attendance. The formula behind every threshold is in the ${h.src('saiGuide', 'FSA SAI and Pell Grant Eligibility Guide')}, and the ${h.a('sai-calculator', 'SAI calculator')} shows how the index itself is built.</p>`,
  related: ['pell-grant-calculator', 'sai-calculator', 'pell-grant-changes', 'workforce-pell', 'negative-sai', 'fafsa-calculator'],
  sources: ['saiGuide', 'frPoverty2024', 'hea401', 'obbba'],
});
