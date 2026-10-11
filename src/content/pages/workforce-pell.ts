import { definePage } from '../../lib/page-types';
import { P, usd, usdx, day, poverty, pellMin } from '../../lib/kit';

const pm = P.pell;
const start = day(P.law.newPlansStart);
/** Value-added earnings illustration: 150% of the 2026 guideline for one person (48 states). */
const floor150 = Math.round(poverty(1, 'us', '2026') * 1.5);
const ex = [{ job: 'Welding certificate', med: 41500, tuition: 9800 }, { job: 'Medical coding certificate', med: 33200, tuition: 11400 }, { job: 'Commercial driver license course', med: 47800, tuition: 6200 }].map((r) => ({ ...r, va: r.med - floor150 }));

export default definePage({
  id: 'workforce-pell',
  group: 'aid',
  kind: 'guide',
  order: 130,
  slug: 'workforce-pell-grants',
  nav: 'Workforce Pell',
  card: 'Pell Grants for 8 to 14 week job-training programs since July 2026: hours, approvals and earnings test',
  title: 'Workforce Pell Grants 2026: Which Short Programs Qualify',
  description: `Workforce Pell Grants since July 2026: programs of 150 to 599 clock hours over 8 to 14 weeks, approved by a governor then ED, paid from the ${usd(pm.max)} Pell maximum.`,
  h1: 'Workforce Pell: Pell Grants for short job-training programs',
  intro: 'For the first time, a Pell Grant can pay for a program that lasts a couple of months. The program, not just the student, has to pass a set of tests.',
  resume: `Workforce Pell Grants pay for short job-training programs from the 2026-27 award year, the first time Pell has covered anything this brief. A program qualifies only if it has at least 150 and fewer than 600 clock hours of instruction, or the credit-hour equivalent, spread over at least 8 and fewer than 15 weeks, and is not a correspondence course. The governor of the state must first certify that it trains for high-skill, high-wage or in-demand jobs and leads to a credential employers recognize; the Department of Education then checks that it has run for at least a year, that 70% of students finish and 70% find work within 180 days, and that tuition does not exceed the earnings gain of past students. The student must meet ordinary Pell rules and may not hold or be seeking a graduate credential. The grant follows the regular ${usd(pm.max)} schedule, prorated for the shorter length, and counts against the 12-semester lifetime limit. Iowa had the first approved program.`,
  mini: 'workforcePellCheck',
  faqs: [
    { q: 'What is a Workforce Pell Grant?', a: `A Pell Grant for an approved short program of 150 to 599 clock hours lasting 8 to 14 weeks, created by section 83002 of Public Law 119-21 and available from ${start}. It uses the same student eligibility as the regular Pell Grant, the same Student Aid Index, and is paid to the school for an eligible workforce program that a governor and the Department have both approved.` },
    { q: 'Which states have approved Workforce Pell programs?', a: 'According to Department of Education announcements, the first approved program was in Iowa, followed by programs in Indiana, Florida, Nebraska, North Carolina and Texas. Approval is program by program, not statewide: each school submits each program after the governor signs off. A program in your state appears only once the Department has approved it.' },
    { q: 'How much does a Workforce Pell Grant pay?', a: `The award follows the regular Pell schedule, up to ${usd(pm.max)} for a full academic year in 2026-27, then is prorated to the length of the program. The law allows an amount below the ${usdx(pellMin)} minimum when the program is shorter than an academic year. A student cannot receive regular Pell and Workforce Pell for the same period.` },
    { q: 'Can I use Workforce Pell if I already have a master’s degree?', a: 'No. The statute bars students who have attained a graduate credential, and students enrolled in a program that leads to one. A bachelor’s degree holder is not named in that bar, but ordinary Pell rules still apply, and those generally stop at the first bachelor’s degree. Ask the school’s aid office how it applies both rules to your record.' },
    { q: 'Does a Workforce Pell program use up my Pell eligibility?', a: 'Yes. Any period of study covered by a Workforce Pell Grant counts toward the lifetime limit of 12 full-time semesters or the equivalent. A short certificate uses only a small slice, in proportion to the award, but a student who later starts a degree will have that much less Pell to draw on.' },
  ],
  body: (h) => `
<h2>Why a two-month program can now get Pell</h2>
<p>Before July 2026, programs this short sat outside Pell, which left out short certificates for welders, truck drivers, phlebotomists and IT support technicians. Students paid cash, used state or employer money, or skipped the training. The 2025 budget law opened a separate door: section 83002 adds subsection (k) to the Pell statute and a new category of "eligible workforce program" to the program-eligibility rules (${h.src('obbba', 'Public Law 119-21, section 83002')}). The Department announced the launch on ${start}, adding that eligible programs can be as short as 8 weeks and that schools could begin submitting them for approval that day (${h.src('edJuly1', 'Department of Education fact sheet, July 1, 2026')}).</p>
<p>Workforce Pell is not a different grant with its own budget line. It is the Pell Grant, run through the same FAFSA and the same index, applied to a different kind of program. What changes is the gatekeeping: a short program must clear more tests than a degree program does.</p>

<h2>The length rule in hours and weeks</h2>
<p>The statute sets two windows that must both be met. Instruction must total at least 150 and fewer than 600 clock hours, or an equivalent number of credit hours. And it must run for at least 8 weeks but fewer than 15. A 120-hour course fails on hours; a 400-hour bootcamp squeezed into six weeks fails on weeks; a 640-hour program is too long for this route. Correspondence courses are excluded outright, using the federal definition in effect on July 1, 2021. The mini-tool above runs the two windows for any program you are considering.</p>
<p>Length is the cheap test. A program can fit both windows and still never become eligible, because the next two layers depend on decisions by the state and on the program's track record.</p>

<h2>First the governor, then the Department</h2>
<p>The governor of the state, after consulting the state workforce board, must find that the program does four things. It trains for jobs in high-skill, high-wage or in-demand sectors as the state defines them. It meets the hiring requirements of employers in those jobs. It leads to a recognized postsecondary credential that is stackable and portable across more than one employer, or to the single credential an occupation requires. And it prepares students to continue toward a certificate or degree, with credit for the short program accepted toward that later study.</p>
<p>Only after the governor's finding does the school apply to the Department. The Secretary then checks the record. The program must have been offered for at least one year before the decision. It must post, for each award year, a verified completion rate of at least 70% within 150% of normal time, and a verified job placement rate of at least 70% measured 180 days after completion. Once approved, it becomes an eligible workforce program and its students can draw Pell. According to Department announcements, the first approval went to a program in Iowa, with programs in Indiana, Florida, Nebraska, North Carolina and Texas following.</p>

<h2>The earnings test, worked through</h2>
<p>The last condition compares price with payoff. Published tuition and fees for the year may not exceed the value-added earnings of federally aided students who completed the program three years earlier. Value-added earnings are their median earnings, adjusted for regional prices, minus 150% of the poverty line for a single person. Using the 2026 guideline for illustration, that subtraction is about ${usd(floor150)}.</p>
${h.table(['Program (illustration)', 'Median earnings of completers', 'Value-added earnings', 'Tuition and fees', 'Passes?'], ex.map((r) => [r.job, usd(r.med), usd(r.va), usd(r.tuition), r.tuition <= r.va ? 'Yes' : 'No']), 'Hypothetical figures; regional price adjustment ignored; poverty line: 2026 HHS guideline for one person, 48 states.', ['l', 'r', 'r', 'r', 'l'])}
<p>The coding certificate fails not because its graduates earn little in absolute terms, but because the margin over the poverty-based floor is thin relative to its price. A school can fix that by cutting tuition, which is exactly the pressure the test is designed to create. Because the test uses completers from three years back, a brand-new program cannot qualify until it has graduates with an earnings history.</p>

<h2>Questions to put to a school before you enroll</h2>
<p>Marketing for short programs moved fast once the grant was announced, and a brochure that says "Pell eligible" is not proof. Ask whether this specific program, at this campus, has been approved by the Department as an eligible workforce program, and on what date. Governor approval alone does not release any money; Pell flows only once the federal step is complete.</p>
<p>Ask for the numbers the approval rests on: the completion rate, the placement rate at 180 days and the published tuition and fees for the year. A program that cleared 70% last year must clear it again each award year, so a sharp drop in either rate is a warning that eligibility could lapse while you are enrolled. Ask which credential you will hold at the end and which employers in your area accept it, since portability across more than one employer is one of the conditions the governor certified.</p>
<p>Finally, ask how the credit will carry forward. The law requires that the short program count toward a related certificate or degree, at the same school or another one. Get the name of that follow-on program in writing. If you later enroll in it, you will already have part of the coursework done and will draw on the same lifetime Pell allowance, so the two plans should be made together.</p>

<h2>What the student needs and what the grant pays</h2>
<p>On the student side, nothing new is required beyond the ordinary Pell rules: a FAFSA, an index low enough for an award, and undergraduate status. The one addition is a bar on graduate credentials: a student who holds one, or who is enrolled in a program leading to one, cannot receive Workforce Pell. The award is calculated the regular way and then prorated to the program's length, and the law lets it fall below the usual ${usdx(pellMin)} minimum when the program is shorter than an academic year. The ${h.a('pell-grant-calculator', 'Pell Grant calculator')} gives the full-year figure the proration starts from.</p>
<p>Two limits follow the student. Workforce Pell and regular Pell cannot be paid for the same period. And every period covered by Workforce Pell counts toward the lifetime limit of 12 full-time semesters, so a student weighing a certificate now and a degree later is spending from the same allowance. The ${h.a('pell-grant-eligibility', 'Pell eligibility guide')} covers the index and income lines that decide the base award, and the ${h.a('pell-grant-changes', 'Pell changes page')} sets Workforce Pell beside the other rules that arrived in 2026.</p>`,
  related: ['pell-grant-calculator', 'pell-grant-eligibility', 'pell-grant-changes', 'fafsa-calculator', '529-calculator'],
  sources: ['obbba', 'edJuly1', 'hea401'],
});
