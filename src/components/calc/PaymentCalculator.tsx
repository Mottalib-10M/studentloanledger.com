/** Monthly payment on the fixed plans: 10-year standard, Tiered Standard (34 CFR 685.208) or a term you choose. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import P from '../../data/params-2026.json';
import { standard10, tieredStandard, amortized } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, Bars, usd } from './parts';

export default function PaymentCalculator({ methodHref = '/en/method/', idPrefix = 'pay', balance = 30000, rate = P.rates.current.undergrad }: { methodHref?: string; idPrefix?: string; balance?: number; rate?: number }) {
  const [v, set] = useCalc({ b: balance, r: rate, p: 'tiered', y: 12 });
  const r = useMemo(() => {
    const tier = tieredStandard(v.b, v.r);
    const plans = [
      { k: 'standard', label: '10-year standard', months: 120, pay: standard10(v.b, v.r) },
      { k: 'tiered', label: `Tiered Standard (${tier.years} years)`, months: tier.months, pay: tier.payment },
      { k: 'custom', label: `Your own term (${Math.max(1, Math.round(v.y))} years)`, months: Math.max(1, Math.round(v.y)) * 12, pay: Math.max(Math.min(P.standard.minPayment, v.b), amortized(v.b, v.r, Math.max(1, Math.round(v.y)) * 12)) },
    ].map((x) => ({ ...x, total: x.pay * x.months, interest: Math.max(0, x.pay * x.months - v.b) }));
    return { plans, chosen: plans.find((x) => x.k === v.p) ?? plans[1] };
  }, [v]);
  const c = r.chosen; const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-bal`} label="Loan balance" value={v.b} onChange={set('b')} unit="$" max={2000000} help="Principal you will repay, all federal loans together." />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} help={`2026-27: ${P.rates.current.undergrad}% undergrad, ${P.rates.current.grad}% grad, ${P.rates.current.plus}% PLUS.`} />
        <SelectField id={`${p}-plan`} label="Repayment plan" value={v.p} onChange={set('p')} options={[{ value: 'tiered', label: 'Tiered Standard' }, { value: 'standard', label: '10-year standard (loans before July 2026)' }, { value: 'custom', label: 'A term I choose' }]} />
        {v.p === 'custom' && <NumberField id={`${p}-yrs`} label="Term" value={v.y} onChange={set('y')} unit="years" max={30} help="For a private loan or an early payoff target." />}
      </form>
      <Result label={`Monthly payment, ${c.label}`} value={usd(c.pay)} sub={`${c.months} payments · ${usd(c.interest)} of interest over the term`} methodHref={methodHref} note="Fixed payment that repays principal and interest by the end of the term; $50 minimum on the federal fixed plans.">
        <Bars items={r.plans.map((x) => ({ label: x.label, value: x.pay, best: x.pay === Math.min(...r.plans.map((y) => y.pay)) }))} />
        <Rows rows={r.plans.map((x) => [`Total repaid, ${x.label}`, usd(x.total)] as [string, string])} />
      </Result>
    </div>
  );
}
