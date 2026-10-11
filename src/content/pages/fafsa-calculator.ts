import { definePage } from '../../lib/page-types';
import { P, usd, day, sai, poverty } from '../../lib/kit';

const S = P.sai;
const fmt = (n: number) => n.toLocaleString('en-US');
/** Married parents of a dependent student, household of four, federal tax paid set at 4% of AGI. */
const four = (agi: number, savings: number) => sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi, taxPaid: Math.round(agi * 0.04), earned: agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: savings });
const rows = [[43000, 3000], [62000, 7000], [86000, 18000], [131000, 35000]].map(([a, s]) => ({ a, s, r: four(a, s) }));
const q = four(68000, 9000);
const q0 = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 68000, taxPaid: 0, earned: 68000 }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: 9000 });
const work = sai({ dependent: true, married: true, familySize: 4, filing: 'mfj', parents: { agi: 68000, taxPaid: Math.round(68000 * 0.04), earned: 68000 }, student: { agi: 16000, taxPaid: 0, earned: 16000 }, assets: 9000 });
const maxLine4 = Math.round((poverty(4, 'us', '2024') * P.pell.maxPellAgiPct.other) / 100);
const cap = P.pell.max * P.pell.highSaiMultiple;

export default definePage({
  id: 'fafsa-calculator',
  group: 'aid',
  kind: 'guide',
  order: 100,
  slug: 'fafsa-calculator',
  nav: 'FAFSA calculator',
  card: 'What the FAFSA works out from your answers, which tax year it reads, and a quick estimate',
  title: 'FAFSA Calculator 2026-27: Estimate Your Aid Before Filing',
  description: `FAFSA calculator for 2026-27: estimate the Student Aid Index the form will compute from 2024 income, family size and savings, and Pell up to ${usd(P.pell.max)} a year.`,
  h1: 'FAFSA calculator: what the form will work out for you',
  intro: 'The FAFSA does not hand out money by itself. It produces one number, the Student Aid Index, and a Pell decision. You can estimate both before you file.',
  resume: `The FAFSA turns your answers into a Student Aid Index and a Pell Grant determination; everything else in a financial aid offer is built on those two results. For the 2026-27 school year the form reads income from the ${S.taxYear} federal tax return, the prior-prior year, and assets as of the day you file. A dependent student with married parents earning ${usd(68000)}, a household of four and ${usd(9000)} in savings would see an SAI near ${fmt(q.sai)} if the parents paid about ${usd(Math.round(68000 * 0.04))} of federal income tax, which points to a Pell Grant of about ${usd(q.pell)} for full-time study. The ${P.fafsa.nextYear} FAFSA opened on ${day(P.fafsa.nextLaunch)}, the earliest launch the Department of Education has ever announced, and it asks for 2025 income. The quick estimate below uses three inputs; the full SAI worksheet adds tax paid, student earnings and independent-student cases. Treat any figure here as a planning number: the official index appears on your FAFSA Submission Summary after the Department processes the form.`,
  mini: 'fafsaQuickSai',
  faqs: [
    { q: 'Is there an official FAFSA estimator I can use before filing?', a: `Federal Student Aid publishes the formula itself, the ${P.pell.awardYear} SAI and Pell Grant Eligibility Guide, with every table and rounding rule spelled out. Any tool that applies that guide, like the calculator on this site, should land within rounding of the official index if you enter the same tax figures. The binding number is the one on your FAFSA Submission Summary.` },
    { q: 'Do I have to file a new FAFSA every year?', a: `Yes. Each award year has its own form and its own tax year: 2026-27 reads ${S.taxYear} income, ${P.fafsa.nextYear} reads 2025 income. The Department says returning students will see answers carried over from their previous form later this fall, which shortens renewal, but the index is computed again each year from the new figures.` },
    { q: 'When should I submit the 2027-28 FAFSA?', a: `As soon as you can after it opens; it went live on ${day(P.fafsa.nextLaunch)}. Federal aid itself has a late deadline, but many states and colleges hand out their own grants on a first-come basis or set early priority dates. Filing in the fall also gives you time to correct a mistake before offers are made.` },
    { q: 'Why does the FAFSA ask about income from two years ago?', a: `Because the prior-prior year is already on file with the IRS when the form opens, so the numbers can be transferred directly rather than typed in. For 2026-27 that is the ${S.taxYear} return. A family whose income has dropped since then can ask the college's aid office to review the change, with pay stubs or a layoff letter as proof.` },
    { q: 'Does the FAFSA count my parents’ retirement savings or our house?', a: `No to both. The asset questions cover cash, savings, checking, investments such as a 529 plan or a second property, and child support received. Money in a 401(k) or an IRA and the home the family lives in stay off the form. Whatever does count adds ${S.parentAssetRate}% of its value to the parents' available income.` },
  ],
  body: (h) => `
<h2>What the form actually produces</h2>
<p>People search for a FAFSA calculator expecting a dollar amount of aid. The form does not produce one. After you submit, the Department of Education runs your answers through the need analysis formula and sends back a Student Aid Index, a Pell Grant eligibility result and a set of flags for the schools you listed. Each college then takes the index, subtracts it from its own cost of attendance and decides how much of the gap it can fill with grants, work-study and federal loans. Two families with the same SAI can therefore receive very different offers from two colleges, while the federal Pell Grant stays the same at any school for the same enrollment.</p>
<p>So the useful estimate before filing has two parts: the index, and the Pell Grant it implies. Everything else on an offer letter depends on the school's budget and policies. The ${h.a('sai-calculator', 'SAI calculator')} reproduces the worksheet line by line, and the ${h.a('pell-grant-calculator', 'Pell Grant calculator')} turns the index into an award. The mini-estimate at the top of this page gives a first figure with only three inputs, which is enough to know which range you are in.</p>

<h2>Which year of income goes on the form</h2>
<p>Every FAFSA looks back two tax years. The 2026-27 form, the one students in college this school year filed, uses the ${S.taxYear} federal return and the ${S.taxYear} HHS poverty guidelines, ${usd(P.fpl['2024'].us[0])} for one person plus ${usd(P.fpl['2024'].us[1])} for each extra person in the 48 states and DC. The ${P.fafsa.nextYear} form, which opened on ${day(P.fafsa.nextLaunch)}, uses 2025 income. Secretary McMahon certified on August 25, 2026 that the form would open on time, and the FAFSA Deadline Act now requires a launch by October 1 each year (${h.src('edFafsa2728', 'Department of Education, September 23, 2026')}).</p>
<p>That two-year lag matters in both directions. A parent who lost a job in 2025 still shows the full 2024 salary on the 2026-27 form, and the right move is a written request to each college's aid office for a review of the change. A parent whose pay jumped last year benefits from the delay for one more cycle. The tables behind the 2026-27 index are fixed; the ${P.fafsa.nextYear} tables are published separately and this site will switch to them once they are final, so estimates for next year made here are a guide rather than a forecast.</p>

<h2>Four households run through the estimate</h2>
<p>To show how quickly the index climbs with income, the table applies the 2026-27 formula to a dependent student whose married parents have a household of four, no student income, federal tax paid of about 4% of AGI and savings that grow with income.</p>
${h.table(['Parents’ AGI', 'Savings', 'SAI', 'Pell, full time'], rows.map(({ a, s, r }) => [usd(a), usd(s), fmt(r.sai), usd(r.pell)]), `Formula A, 2026-27 tables, 48 states and DC. Twice the maximum Pell is ${fmt(cap)}.`, ['l', 'r', 'r', 'r'])}
<p>The first family sits under the maximum-Pell income line for four people, ${usd(maxLine4)}, so its index is capped at zero or below and the student receives the full ${usd(P.pell.max)}. The second and third families fall in the sliding zone where Pell equals the maximum minus the index. The fourth family is past the cut-off the 2025 law added: an index of ${fmt(cap)} or more blocks Pell entirely, whatever the income lines say. That family's index still matters, because colleges use it to size their own grants and federal subsidized loans.</p>

<h2>The inputs that move the number most</h2>
<p>Parents' income dominates the formula, but three other inputs are worth getting right. Federal income tax paid is subtracted in full before anything is assessed, so leaving it out inflates the result: the same ${usd(68000)} family has an index of ${fmt(q0.sai)} with tax at zero and ${fmt(q.sai)} with ${usd(Math.round(68000 * 0.04))} of tax. Household size raises the income protection allowance, ${usd(S.ipaParent.base[1])} for three people and ${usd(S.ipaParent.base[2])} for four, so counting every person the parents support is worth the care.</p>
<p>Student earnings come next. Money the student earned is protected up to ${usd(S.ipaDependentStudent)} after taxes; half of anything above that is added to the index. A student in the same family who earned ${usd(16000)} in ${S.taxYear} pushes the index from ${fmt(q.sai)} to ${fmt(work.sai)}. That is often the surprise in a family that did everything else right, and it is why summer earnings in the base year deserve a look before filing.</p>
<p>Assets play a smaller role than many parents fear. With no asset protection allowance at any age in 2026-27, ${S.parentAssetRate}% of reportable savings is added to available income, and then only part of that flows into the index through the assessment rates of 22% to 47%. Ten thousand dollars of savings typically moves the index by a few hundred points, not thousands.</p>

<h2>From an index to an offer letter</h2>
<p>Once the index exists, each college applies a simple identity: cost of attendance minus SAI minus other aid equals remaining need. The Pell Grant is set by the index and the income lines alone, so it travels with the student from school to school. Subsidized loans, work-study and the college's own grants are sized against the remaining need, and the last of those follows each college's own rules and budget. The ${h.a('net-price-calculator', 'net price calculator page')} covers how to compare offers once they arrive.</p>
<p>When the offers come in, read the Pell line first. It should match the estimate here within rounding for full-time study; if it is lower, check whether the school assumed part-time enrollment. Then look at what is a grant and what is a loan. A loan listed in the offer is an option you can decline or reduce, and its cost follows the federal rules on the ${h.a('how-much-student-loan', 'loan limits page')}.</p>

<h2>Before you open the form</h2>
<p>Gather the ${S.taxYear} federal returns for the student and each parent who must contribute, the balances of savings and investment accounts on the day you file, and the number of people in the household. Each contributor needs a StudentAid.gov account and gives consent for the IRS to share tax data with the form. According to the Department, the ${P.fafsa.nextYear} form can be finished in as little as 15 minutes, contributors can now be invited by text message as well as email, and applicants see a Pell result in real time. Those are the Department's own descriptions; your time will depend on how many contributors your form needs. The full method, with every table the estimate uses, is in the ${h.src('saiGuide', 'FSA SAI and Pell Grant Eligibility Guide')} and on the ${h.a('method', 'method page')}.</p>`,
  related: ['sai-calculator', 'pell-grant-calculator', 'pell-grant-eligibility', 'negative-sai', 'efc-calculator', 'net-price-calculator'],
  sources: ['edFafsa2728', 'saiGuide', 'needAnalysis', 'frPoverty2024'],
});
