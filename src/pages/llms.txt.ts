/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../lib/topics';
import P from '../data/params-2026.json';
export function GET() {
  const R = P.rates.current;
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Federal student loan calculators after Public Law 119-21 (July 4, 2025) and the Department of Education regulations of May 1, 2026: the Repayment Assistance Plan (1% to 10% of AGI, $${P.rap.perDependent} off per dependent, $${P.rap.minPayment} minimum, interest waiver and principal match up to $${P.rap.matchMax}), Income-Based Repayment, the Tiered Standard plan (10 to 25 years), PSLF projections, 2026-27 interest rates (${R.undergrad}%, ${R.grad}%, ${R.plus}%), loan limits, the student loan interest deduction for 2026 and the 2026-27 Student Aid Index and Pell Grant (maximum $${P.pell.max}). Figures come from the law, 34 CFR 685, the Federal Register, the Department of Education and the IRS, cited on each page. Calculations run in the browser. Estimates; the servicer and the school decide. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    `- [Home: plan comparator](${SITE_URL}${route('home', 'en')})`,
    ...GROUPS.flatMap((g) => { const xs = PAGES.filter((p) => p.group === g.id); return xs.length ? ['', `## ${g.label}`, ...xs.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`)] : []; }),
    '',
    '## About',
    `- [How we calculate](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
