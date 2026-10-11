/**
 * Every page of the plan (CONTRIBUTING-PAGES.md), with the measured query it answers
 * (Keyword Planner, plan 1442433080, 2026-10-10). The page test checks that each page file matches its line.
 */
export type Kind = 'pillar' | 'guide';
export const PLANNED_PAGES: Array<{ id: string; group: string; kind: Kind; slug: string; query: string }> = [
  // Repayment
  { id: 'student-loan-payment-calculator', group: 'repay', kind: 'pillar', slug: 'student-loan-payment-calculator', query: 'student loan payment calculator (10k-100k)' },
  { id: 'rap-calculator', group: 'repay', kind: 'pillar', slug: 'rap-calculator', query: 'repayment assistance plan calculator, idr calculator' },
  { id: 'ibr-calculator', group: 'repay', kind: 'pillar', slug: 'ibr-calculator', query: 'ibr calculator (1k-10k)' },
  { id: 'student-loan-payoff-calculator', group: 'repay', kind: 'pillar', slug: 'student-loan-payoff-calculator', query: 'student loan payoff calculator (1k-10k)' },
  { id: 'student-loan-interest-calculator', group: 'repay', kind: 'pillar', slug: 'student-loan-interest-calculator', query: 'student loan interest calculator (1k-10k)' },
  { id: 'student-loan-refinance-calculator', group: 'repay', kind: 'pillar', slug: 'student-loan-refinance-calculator', query: 'student loan refinance calculator (1k-10k)' },
  { id: 'income-driven-repayment-plans', group: 'repay', kind: 'guide', slug: 'income-driven-repayment-plans', query: 'income driven repayment calculator, idr calculator (100-1k)' },
  { id: 'rap-vs-ibr', group: 'repay', kind: 'guide', slug: 'rap-vs-ibr', query: 'rap vs ibr' },
  { id: 'tiered-standard-repayment-plan', group: 'repay', kind: 'guide', slug: 'tiered-standard-repayment-plan', query: 'tiered standard repayment plan' },
  { id: 'save-plan-calculator', group: 'repay', kind: 'guide', slug: 'save-plan-calculator', query: 'save plan calculator, repaye calculator (100-1k)' },
  { id: 'repayment-plan-deadline', group: 'repay', kind: 'guide', slug: 'repayment-plan-deadline-2028', query: 'icr paye phase out july 2028' },
  { id: 'rap-interest-waiver-and-match', group: 'repay', kind: 'guide', slug: 'rap-interest-waiver-and-matching-payment', query: 'rap interest waiver matching payment' },
  { id: 'married-borrowers', group: 'repay', kind: 'guide', slug: 'student-loans-married-filing-separately', query: 'student loans married filing separately' },
  { id: 'autopay-rate-reduction', group: 'repay', kind: 'guide', slug: 'autopay-interest-rate-reduction', query: 'student loan auto pay interest rate reduction' },
  { id: 'student-loan-consolidation', group: 'repay', kind: 'guide', slug: 'student-loan-consolidation', query: 'student loan consolidation' },
  { id: 'default-rehabilitation', group: 'repay', kind: 'guide', slug: 'student-loan-default-rehabilitation', query: 'student loan rehabilitation' },
  { id: 'deferment-forbearance', group: 'repay', kind: 'guide', slug: 'deferment-and-forbearance-changes', query: 'student loan deferment forbearance' },
  // Forgiveness
  { id: 'student-loan-forgiveness', group: 'forgive', kind: 'pillar', slug: 'student-loan-forgiveness', query: 'student loan forgiveness (100k-1M), student loan forgiveness calculator' },
  { id: 'pslf-calculator', group: 'forgive', kind: 'pillar', slug: 'pslf-calculator', query: 'pslf calculator (100-1k), pslf (10k-100k)' },
  { id: 'public-service-loan-forgiveness', group: 'forgive', kind: 'guide', slug: 'public-service-loan-forgiveness', query: 'public service loan forgiveness (10k-100k)' },
  { id: 'pslf-employer-rule', group: 'forgive', kind: 'guide', slug: 'pslf-qualifying-employer-rule', query: 'pslf qualifying employer' },
  { id: 'forgiveness-taxes', group: 'forgive', kind: 'guide', slug: 'student-loan-forgiveness-taxes', query: 'is student loan forgiveness taxable' },
  { id: 'idr-forgiveness-timeline', group: 'forgive', kind: 'guide', slug: 'idr-forgiveness-timeline', query: 'idr forgiveness 20 25 30 years' },
  // Borrowing
  { id: 'interest-rates', group: 'borrow', kind: 'guide', slug: 'federal-student-loan-interest-rates', query: 'student loan interest rates 2026-27' },
  { id: 'how-much-student-loan', group: 'borrow', kind: 'pillar', slug: 'how-much-student-loan-can-i-get', query: 'how much student loan can i get (100-1k)' },
  { id: 'graduate-loan-limits', group: 'borrow', kind: 'guide', slug: 'graduate-student-loan-limits', query: 'graduate student loan limits 2026' },
  { id: 'professional-loan-limits', group: 'borrow', kind: 'guide', slug: 'professional-student-loan-limits', query: 'professional student loan limits 2026' },
  { id: 'grad-plus-ending', group: 'borrow', kind: 'guide', slug: 'grad-plus-loans-ending', query: 'grad plus loan eliminated' },
  { id: 'parent-plus-loan-calculator', group: 'borrow', kind: 'pillar', slug: 'parent-plus-loan-calculator', query: 'parent plus loan calculator (100-1k)' },
  { id: 'parent-plus-repayment', group: 'borrow', kind: 'guide', slug: 'parent-plus-repayment-options', query: 'parent plus loan repayment options' },
  { id: 'lifetime-loan-limit', group: 'borrow', kind: 'guide', slug: 'lifetime-student-loan-limit', query: 'lifetime student loan limit' },
  // FAFSA, SAI and Pell
  { id: 'sai-calculator', group: 'aid', kind: 'pillar', slug: 'sai-calculator', query: 'sai calculator, student aid index calculator (1k-10k each)' },
  { id: 'pell-grant-calculator', group: 'aid', kind: 'pillar', slug: 'pell-grant-calculator', query: 'pell grant calculator (1k-10k), how much pell grant will i get' },
  { id: 'fafsa-calculator', group: 'aid', kind: 'guide', slug: 'fafsa-calculator', query: 'fafsa calculator (1k-10k)' },
  { id: 'pell-grant-eligibility', group: 'aid', kind: 'guide', slug: 'pell-grant-eligibility', query: 'pell grant eligibility (10k-100k)' },
  { id: 'pell-grant-changes', group: 'aid', kind: 'guide', slug: 'pell-grant-changes', query: 'pell grant changes 2026' },
  { id: 'workforce-pell', group: 'aid', kind: 'guide', slug: 'workforce-pell-grants', query: 'workforce pell grant' },
  { id: 'efc-calculator', group: 'aid', kind: 'guide', slug: 'efc-calculator', query: 'efc calculator (100-1k)' },
  { id: 'negative-sai', group: 'aid', kind: 'guide', slug: 'negative-sai', query: 'negative sai, sai -1500' },
  { id: 'fafsa-business-farm', group: 'aid', kind: 'guide', slug: 'fafsa-small-business-family-farm', query: 'fafsa small business family farm' },
  // Tax and savings
  { id: 'student-loan-interest-deduction', group: 'tax', kind: 'pillar', slug: 'student-loan-interest-deduction', query: 'student loan interest deduction (10k-100k)' },
  { id: 'employer-student-loan-repayment', group: 'tax', kind: 'guide', slug: 'employer-student-loan-repayment', query: 'employer student loan repayment tax free' },
  { id: '529-calculator', group: 'tax', kind: 'pillar', slug: '529-plan-calculator', query: '529 calculator (10k-100k)' },
  { id: 'college-savings-calculator', group: 'tax', kind: 'pillar', slug: 'college-savings-calculator', query: 'college savings calculator (1k-10k)' },
  { id: 'net-price-calculator', group: 'tax', kind: 'guide', slug: 'net-price-calculator', query: 'net price calculator (1k-10k)' },
];
export const PLANNED_IDS = [...PLANNED_PAGES.map((p) => p.id), 'home', 'method', 'about'];
