import { definePage } from '../../lib/page-types';
import { P, usd, usdx, day, sai, pellMin } from '../../lib/kit';

const pm = P.pell;
const fmt = (n: number) => n.toLocaleString('en-US');
const cap = pm.max * pm.highSaiMultiple;
const cut = Math.round(pm.max - pellMin);
const start = day(P.law.newPlansStart);
/** Married parents, household of three, modest income but large savings in a brokerage account: high index, AGI under the minimum line. */
const stock = 320000;
const rich = sai({ dependent: true, married: true, familySize: 3, filing: 'mfj', parents: { agi: 64000, taxPaid: 3000, earned: 64000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: stock });
const coa = 34500;

export default definePage({
  id: 'pell-grant-changes',
  group: 'aid',
  kind: 'guide',
  order: 120,
  slug: 'pell-grant-changes',
  nav: 'Pell changes 2026',
  card: 'The four Pell Grant rules the 2025 law added from July 1, 2026, and who they cut off',
  title: 'Pell Grant Changes 2026: Four New Rules From the 2025 Law',
  description: `Pell Grant changes for 2026-27: an SAI of ${fmt(cap)} or more now blocks Pell, foreign income counts, full outside grants cancel it, and Workforce Pell opens.`,
  h1: 'What changed for Pell Grants in 2026',
  intro: 'The award amount stayed in the hands of Congress’s yearly budget. What the 2025 law rewrote is who can receive it.',
  resume: `Public Law 119-21, signed on ${day(P.law.enacted)}, made four changes to the Pell Grant that took effect on ${start}, for the 2026-27 award year. First, a student whose Student Aid Index equals or exceeds twice the maximum Pell Grant, ${fmt(cap)} this year, gets no Pell at all, even when family income is under a minimum-award line. Second, foreign income excluded from U.S. tax is now added to AGI when that income is compared with the Pell lines. Third, a student whose grants from states, colleges or private donors already equal or exceed the cost of attendance for a period receives no Pell for that period. Fourth, Workforce Pell now pays for short job-training programs of 8 to 14 weeks. The maximum award itself, ${usd(pm.max)}, comes from the February 2026 appropriations law plus the ${usd(pm.mandatory)} the Higher Education Act adds, and the minimum is still 10% of it. The checker below applies the first and third rules to your own numbers.`,
  mini: 'pellNewRules',
  faqs: [
    { q: 'What changed with Pell Grants in 2026?', a: `From ${start}, four rules from the 2025 law apply: no Pell with an index of ${fmt(cap)} or more, foreign income added to AGI for the Pell lines, no Pell when outside grants cover the full cost of attendance, and a new Workforce Pell Grant for 8 to 14 week programs. The maximum award for 2026-27 is ${usd(pm.max)}.` },
    { q: 'Why would a student with a high SAI lose Pell now?', a: `Before July 2026 a student could reach the minimum award through the income lines alone, even with a large index driven by assets. Section 83001(b) closes that path: an index equal to or above twice the total maximum Pell, ${fmt(cap)} for 2026-27, means no Pell for the year, whatever the income. The rule sits in 20 U.S.C. 1070a(b)(1)(F).` },
    { q: 'Will a full-ride scholarship cancel my Pell Grant?', a: 'It can. If grants from non-federal sources, such as a state program, the college or a private foundation, equal or exceed your cost of attendance for a period, section 83004 makes you ineligible for Pell during that period. Loans and work earnings do not count toward that test. A scholarship that leaves even part of the cost uncovered keeps Pell available.' },
    { q: 'Did the 2025 law cut the maximum Pell Grant?', a: `No. The law did not touch the award formula. The 2026-27 maximum of ${usd(pm.max)} is ${usd(pm.appropriated)} set by Public Law 119-75 of February 3, 2026 plus ${usd(pm.mandatory)} of mandatory funding. Section 83003 raised the money reserved for a Pell funding shortfall from $2.17 billion to $12.67 billion.` },
    { q: 'Does foreign income count for Pell Grant eligibility now?', a: `Yes, from the 2026-27 award year. Income earned abroad and excluded from U.S. tax is added to adjusted gross income before the comparison with the Pell lines, for the parents of a dependent student or for an independent student and spouse. A family with little U.S. AGI but sizable excluded wages can lose the automatic full award of ${usd(pm.max)}.` },
  ],
  body: (h) => `
<h2>The four changes side by side</h2>
<p>All four rules come from Title VIII of the 2025 budget law, which the Department of Education now refers to as the Working Families Tax Cuts Act. Each one took effect on ${start} and applies to award year 2026-27 and every year after it.</p>
${h.table(['Rule', 'Section', 'Who it reaches'], [['No Pell with an index at or above twice the maximum', '83001(b)', `Index of ${fmt(cap)} or more in 2026-27`], ['Foreign income added to AGI for Pell', '83001(a)', 'Families with income excluded from U.S. tax'], ['No Pell when outside grants cover the cost', '83004', 'Students whose state, school and private grants reach the cost of attendance'], ['Workforce Pell for short programs', '83002', 'Students in approved programs of 150 to 599 clock hours']], 'Public Law 119-21, Title VIII, Subtitle D.', ['l', 'l', 'l'])}
<p>Three of the four take Pell away from some students; the fourth extends it to a group that never had access. None of them changes how the Student Aid Index is computed, which is why a family can see the same index as last year and still a different Pell result.</p>

<h2>A ceiling on the index</h2>
<p>Until this year the Pell decision had a back door. A student whose index was too high for a sliding award could still receive the minimum, ${usdx(pellMin)}, if family AGI sat under the minimum-award line. The index could be large for reasons that have nothing to do with income: savings, investments, a second property. Section 83001(b) shuts that door. When the index equals or exceeds twice the total maximum Pell Grant, the student is not eligible for that year (${h.src('obbba', 'Public Law 119-21, section 83001')}).</p>
<p>Picture parents of a household of three with ${usd(64000)} of AGI, comfortably under their minimum-award line, and ${usd(stock)} in a brokerage account. Their student's index comes to about ${fmt(rich.sai)}. Under last year's rules that student could have collected the minimum award; under the new one, ${rich.sai >= cap ? 'nothing' : `the result is ${usd(rich.pell)}`}. The cut-off moves with the maximum award, so the threshold will change whenever Congress changes the award. Families who sit just above it should know that ${P.sai.parentAssetRate}% of reportable assets flows into the parents' side of the formula, and paying down a debt or a necessary purchase made before filing changes what is reported on the day of filing.</p>
<p>The checker at the top of this page asks for an index rather than computing one, because the cut-off is a pure comparison: type the figure from your FAFSA Submission Summary, or from the ${h.a('sai-calculator', 'SAI calculator')}, and it tells you which side of ${fmt(cap)} you are on. The rule bites hardest in a narrow band. Below ${fmt(cut)} the sliding award applies as before. Between ${fmt(cut + 1)} and ${fmt(cap - 1)} the minimum award survives for families under the minimum-award line. Only at ${fmt(cap)} and above does the new ban take over. The students who lose money are the ones with modest income and substantial assets, for example a family that sold a rental property and still holds the cash, or one that received an inheritance shortly before filing.</p>

<h2>Foreign income enters the test</h2>
<p>The Pell lines compare AGI with a percentage of the poverty guideline. AGI leaves out foreign earned income that a U.S. taxpayer living abroad excludes on the return. From 2026-27, for Pell determinations only, that foreign income is added back, both for the parents of a dependent student and for an independent student and spouse. The FSA guide already builds it into the check: it tests AGI plus the foreign income exclusion amount against the ${pm.maxPellAgiPct.other}% and ${pm.maxPellAgiPct.singleParent}% lines.</p>
<p>The effect is concentrated. Most families report no excluded income and see no change. A family working overseas that showed almost no U.S. AGI could previously clear the full-award line with ease, and can now land in the sliding zone or above it. The ${h.a('pell-grant-eligibility', 'Pell eligibility page')} lists the lines by family size.</p>

<h2>When outside grants already pay the bill</h2>
<p>Section 83004 adds a short sentence to the Pell statute: a student is not eligible during any period for which grant aid from non-federal sources, including states, colleges and private sources, equals or exceeds the student's cost of attendance for that period. Take a student at a school with a ${usd(coa)} cost of attendance. A state award, an institutional scholarship and a foundation grant adding up to ${usd(coa)} or more remove Pell for that period. If the three add up to ${usd(coa - 1500)}, Pell stays, and the school then fits it inside the remaining need under its usual packaging.</p>
<p>The test is per period, so a student with a generous fall scholarship and a smaller spring one may keep Pell for spring. Only grant aid counts; loans, work-study earnings and family contributions do not. A student who expects a full ride should ask the aid office how the period is defined at that school before accepting.</p>
<p>Cost of attendance is the school's own budget figure, not just tuition. It includes housing, food, books, transportation and personal costs, so a scholarship described as full tuition rarely reaches it. The rule mostly touches students with several overlapping awards at lower-cost schools, where the combined total can pass the whole budget. When that happens, keeping the extra grant is usually still worth more than the Pell Grant it displaces; the student simply cannot have both for the same period.</p>

<h2>Workforce Pell and the shortfall reserve</h2>
<p>The one expansion in the package is Workforce Pell, launched on ${start}. It pays for short programs, from 150 to 599 clock hours over 8 to 14 weeks, that a governor and then the Department have approved, and it uses the same eligibility rules as the regular grant. Programs must show completion and job placement of 70% and earnings that justify their tuition. Students who hold or are pursuing a graduate credential cannot use it. The ${h.a('workforce-pell', 'Workforce Pell guide')} walks through each approval step.</p>
<p>Section 83003 also raised the money set aside to cover a Pell funding shortfall, from $2.17 billion to $12.67 billion. That is a budget measure, not a change in what any student receives.</p>

<h2>What stayed the same</h2>
<p>The award for a student with an index of zero or less is still the full maximum, and a student with an index from 1 to ${fmt(cut)} still receives the maximum minus the index. The minimum remains 10% of the maximum. Lifetime eligibility is still capped at the equivalent of 12 full-time semesters, and Workforce Pell periods count toward it. The automatic full award for families under the ${pm.maxPellAgiPct.other}% or ${pm.maxPellAgiPct.singleParent}% lines and for non-filers is unchanged. The ${h.a('pell-grant-calculator', 'Pell Grant calculator')} applies the old and new rules together, and the maximum award is documented in ${h.src('approps', 'Public Law 119-75')}.</p>`,
  related: ['pell-grant-calculator', 'pell-grant-eligibility', 'workforce-pell', 'sai-calculator', 'fafsa-business-farm'],
  sources: ['obbba', 'approps', 'hea401', 'saiGuide'],
});
