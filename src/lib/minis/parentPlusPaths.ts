/** Repayment menu for a parent PLUS loan (HEA 455(d)(7)(E); 34 CFR 685.209(b)(6)-(7), (c)(5)(ii), (d)(5)). */
import type { MiniSpec } from '../mini-types';
import { tieredStandard } from '../engine/loans';
import { P, usd } from './_kit';
const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export default (): MiniSpec => ({
  title: 'Which plans your parent PLUS loan can use',
  cta: 'Model the parent PLUS balance and caps',
  ctaHref: '/en/parent-plus-loan-calculator/',
  inputs: [
    { id: 's', label: 'Your situation', def: 2, options: [
      { value: '0', label: 'Parent PLUS made from July 2026 on' },
      { value: '1', label: 'Older parent PLUS, never consolidated' },
      { value: '2', label: 'Consolidated before July 2026, no new loan' },
      { value: '3', label: 'Any parent PLUS, plus a new Direct Loan from July 2026' },
    ] },
    { id: 'bal', label: 'Parent PLUS balance', def: 48000, unit: '$', max: 2000000 },
    { id: 'rate', label: 'Interest rate (%)', def: P.rates.current.plus, decimals: 3, max: 20 },
  ],
  run: (v) => {
    const t = tieredStandard(v.bal, v.rate);
    const s = Math.round(v.s);
    const route = s === 2 ? `ICR first; IBR opens after one ICR payment made by ${day(P.law.oldPlansLastDay)}` : s === 1 ? 'None: a consolidation made now is Tiered Standard only' : 'None: Tiered Standard only';
    const plan = s === 1 ? 'Current fixed plan; a new consolidation goes to Tiered Standard' : s === 2 ? 'ICR now, IBR later, or a fixed plan' : 'Tiered Standard';
    return {
      head: [`Tiered Standard payment (${t.years} years)`, usd(t.payment)],
      rows: [
        ['Plans open to the loan', plan],
        ['Income-driven route', route],
        ['RAP', 'Closed to parent PLUS and its consolidations'],
      ],
      note: 'A consolidation counts from its disbursement date, not the application date.',
    };
  },
});
