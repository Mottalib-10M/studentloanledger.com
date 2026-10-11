import { definePage } from '../../lib/page-types';
import { P, usd, usdx, sai, poverty, pellMin } from '../../lib/kit';

const pm = P.pell;
const cut = Math.round(pm.max - pellMin);
const fam = (agi: number, tax: number, assets: number) => sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi, taxPaid: tax, earned: agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets });
const a = fam(60000, 2000, 8000); const b = fam(75000, 4000, 10000); const c = fam(95000, 7500, 20000);
const fmt = (n: number) => n.toLocaleString('en-US');
const line = (pct: number, n = 4) => usd(Math.round(poverty(n, 'us', '2024') * pct / 100));

export default definePage({
  id: 'pell-grant-calculator',
  group: 'aid',
  kind: 'pillar',
  order: 20,
  slug: 'pell-grant-calculator',
  nav: 'Pell Grant calculator',
  card: 'How much Pell Grant you could get in 2026-27, from the SAI and the income lines',
  title: 'Pell Grant Calculator 2026-27: How Much You Could Get',
  description: `Pell Grant calculator 2026-27: your award from the Student Aid Index, up to ${usd(pm.max)} full time or the ${usdx(pellMin)} minimum, with the income lines for each case.`,
  h1: 'Pell Grant calculator for 2026-27',
  intro: 'How much Pell Grant a student can expect for the 2026-27 award year, from the same inputs as the FAFSA.',
  resume: `The maximum Pell Grant for 2026-27 is ${usd(pm.max)} for a full-time student: ${usd(pm.appropriated)} set by the appropriations law of February 3, 2026, plus the ${usd(pm.mandatory)} the Higher Education Act adds every year. A student receives the maximum when the Student Aid Index is 0 or below, which happens automatically when the parents of a dependent student, or an independent student, had 2024 income at or under 175% of the poverty guideline, or 225% for a single parent. Above that, the grant equals the maximum minus the SAI, until the SAI passes ${fmt(cut)}. A family of four with ${usd(75000)} of income and modest savings would see an SAI near ${fmt(b.sai)} and a grant of about ${usd(b.pell)}. Students who miss that cut can still get the minimum award, ${usdx(pellMin)}, if their income is under a second set of lines, unless their SAI is at least twice the maximum Pell, a rule added by the 2025 law. Your school adjusts the award for enrollment below full time.`,
  tool: 'pell',
  faqs: [
    { q: 'How much Pell Grant will I get in 2026-27?', a: `Roughly ${usd(pm.max)} minus your Student Aid Index, for full-time enrollment, if the SAI is ${fmt(cut)} or less. An SAI of 0 or below gives the full ${usd(pm.max)}. Part-time students receive a share based on enrollment intensity, set by the school. The calculator estimates the SAI from your 2024 income and assets.` },
    { q: 'What is the income limit for a Pell Grant?', a: `There is no single limit. The maximum award goes to families with 2024 AGI at or under 175% of the poverty guideline, ${line(175)} for a family of four in the 48 states, or 225% for a single parent. Others qualify through the SAI. The minimum award reaches up to 275%, 325%, 350% or 400% of poverty depending on the family type.` },
    { q: 'How is the 2026-27 maximum Pell Grant set?', a: `By two laws. The consolidated appropriations act of February 3, 2026 fixed the base at ${usd(pm.appropriated)} for award year 2026-2027, and the Higher Education Act adds ${usd(pm.mandatory)} every year, rounded to the nearest $5: ${usd(pm.max)} in total. The 2025 budget law raised the money set aside for a Pell funding shortfall rather than the award itself.` },
    { q: 'Can I get a Pell Grant for a graduate degree?', a: 'No. Pell Grants are for undergraduates who have not earned a bachelor’s or professional degree, with a narrow exception for some teacher certification programs. The new Workforce Pell Grant for short programs is also closed to students who have or are pursuing a graduate credential.' },
    { q: 'How long can I receive Pell Grants?', a: 'For the equivalent of twelve full-time semesters, about six years, over a lifetime. Each award year of full-time Pell uses 100% of that allowance; part-time use counts in proportion. Periods covered by a Workforce Pell Grant count toward the same limit, so short programs use part of the allowance.' },
    { q: 'Do scholarships reduce my Pell Grant?', a: 'Usually not the Pell Grant itself; schools reduce other aid first when total aid would exceed need. A new rule from July 1, 2026 is an exception: a student who receives non-federal grants, from a state, the school or a private source, equal to or above the full cost of attendance gets no Pell Grant for that period.' },
  ],
  body: (h) => `
<h2>Three families, three awards</h2>
<p>The table runs the calculator for a dependent student with married parents and a household of four, at three income levels, with savings rising alongside income. It shows how fast the grant falls once income passes the maximum-Pell line of ${line(175)}.</p>
${h.table(['Parents’ 2024 AGI', 'Savings', 'SAI', 'Estimated Pell, full time'], [[usd(60000), usd(8000), fmt(a.sai), usd(a.pell)], [usd(75000), usd(10000), fmt(b.sai), usd(b.pell)], [usd(95000), usd(20000), fmt(c.sai), usd(c.pell)]], 'Federal income tax paid estimated by the user; 48 states and DC; 2024 poverty guidelines.', ['l', 'r', 'r', 'r'])}
<h2>The three steps behind the estimate</h2>
<p>The Federal Student Aid guide sets the order. Step one checks maximum-Pell eligibility: non-filers and families under the 175% or 225% line get the full ${usd(pm.max)}. Step two computes the SAI and gives the maximum minus the SAI when it is no higher than the maximum minus the minimum award. Step three catches students left out: those under the minimum-Pell income lines (275% of poverty for dependent students with two parents, ${line(275)} for four people, 325% for a single parent, and for independent students 400%, 350% or 275% depending on whether they are single parents, other parents or not parents) receive ${usdx(pellMin)} as long as their SAI is below twice the maximum (${h.src('saiGuide', 'FSA SAI and Pell Grant Eligibility Guide')}).</p>
<h2>New rules from July 1, 2026</h2>
<p>Public Law 119-21 added three conditions. A student whose SAI equals or exceeds twice the total maximum Pell, ${usd(pm.max * pm.highSaiMultiple)} for 2026-27, is not eligible for that year. Foreign income excluded from U.S. tax now counts in the AGI used to test Pell eligibility. And no Pell is paid for a period in which non-federal grants already cover the full cost of attendance. The same law created Workforce Pell for programs of 8 to 14 weeks (${h.src('obbba', 'Public Law 119-21, sections 83001 to 83004')}). The ${h.a('pell-grant-changes', 'Pell changes page')} covers each one.</p>
<h2>Independent students and single parents</h2>
<p>An independent student's own 2024 income replaces the parents'. The lines differ by situation. A single parent qualifies for the maximum award up to 225% of poverty, ${line(225, 2)} for a family of two, and for the minimum award up to 400%. A student with children who is married uses 175% and 350%. A student with no children uses 175% and 275%, ${line(175, 1)} and ${line(275, 1)} for one person. Single-parent status in the guide depends on filing status, such as head of household, or on having claimed the earned income tax credit.</p>
<h2>From scheduled award to the money you receive</h2>
<p>The calculator gives the scheduled award for full-time enrollment over a full year. The school then applies your enrollment intensity: three quarters of full time receives about three quarters of the award. Pell is paid to the school, which applies it to tuition and fees and refunds any remainder to the student, usually each term. It does not have to be repaid unless you withdraw early in a term. The maximum and the rules come from ${h.src('approps', 'Public Law 119-75')} and ${h.src('hea401', '20 U.S.C. 1070a')}; the ${h.a('sai-calculator', 'SAI calculator')} shows every line of the index.</p>`,
  related: ['sai-calculator', 'pell-grant-eligibility', 'pell-grant-changes', 'workforce-pell', 'fafsa-calculator', 'net-price-calculator'],
  sources: ['approps', 'hea401', 'saiGuide', 'obbba', 'frPoverty2024'],
});
