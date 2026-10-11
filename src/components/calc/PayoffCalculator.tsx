/** Payoff calculator: what an extra amount each month saves on a fixed-rate federal or private loan. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import P from '../../data/params-2026.json';
import { payoff, standard10 } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, ym } from './parts';

export default function PayoffCalculator({ methodHref = '/en/method/', idPrefix = 'off', balance = 30000, rate = P.rates.current.undergrad }: { methodHref?: string; idPrefix?: string; balance?: number; rate?: number }) {
  const def = Math.round(standard10(balance, rate));
  const [v, set] = useCalc({ b: balance, r: rate, m: def, x: 150 });
  const base = useMemo(() => payoff(v.b, v.r, v.m), [v]);
  const fast = useMemo(() => payoff(v.b, v.r, v.m, v.x), [v]);
  const p = idPrefix;
  const never = base.never;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-bal`} label="Loan balance" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={25} decimals={2} />
        <NumberField id={`${p}-pay`} label="Monthly payment now" value={v.m} onChange={set('m')} unit="$" max={100000} help="Your current required payment." />
        <NumberField id={`${p}-x`} label="Extra each month" value={v.x} onChange={set('x')} unit="$" max={100000} help="Ask the servicer to apply it to principal." />
      </form>
      <Result label="Time saved with the extra payment" value={never ? 'No payoff' : ym(Math.max(0, base.months - fast.months))} sub={never ? 'The payment does not cover the monthly interest' : `Debt-free in ${ym(fast.months)} instead of ${ym(base.months)}`} methodHref={methodHref} note="Fixed rate, payments every month, extra applied to principal. On RAP or IBR an extra payment can change the waiver or the forgiveness: check those pages first.">
        <Rows rows={never ? [['Monthly interest on this balance', usd((v.b * v.r) / 1200)]] : [
          ['Interest at the current payment', usd(base.interest)],
          ['Interest with the extra', usd(fast.never ? 0 : fast.interest)],
          ['Interest saved', usd(Math.max(0, base.interest - fast.interest))],
          ['Monthly interest today', usd((v.b * v.r) / 1200)],
        ]} />
      </Result>
    </div>
  );
}
