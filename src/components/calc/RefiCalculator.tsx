/** Refinance calculator: a private rate against your federal loans, with what refinancing gives up. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import P from '../../data/params-2026.json';
import { amortized, rapPayment } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd } from './parts';

export default function RefiCalculator({ methodHref = '/en/method/', idPrefix = 'refi', balance = 60000 }: { methodHref?: string; idPrefix?: string; balance?: number }) {
  const [v, set] = useCalc({ b: balance, r: P.rates.current.grad, y: 10, n: 5.5, t: 10, i: 70000 });
  const r = useMemo(() => {
    const now = amortized(v.b, v.r, Math.max(1, v.y) * 12); const nowTotal = now * Math.max(1, v.y) * 12;
    const neu = amortized(v.b, v.n, Math.max(1, v.t) * 12); const neuTotal = neu * Math.max(1, v.t) * 12;
    return { now, nowTotal, neu, neuTotal, rap: rapPayment({ agi: v.i, dependents: 0 }).payment };
  }, [v]);
  const p = idPrefix;
  const saved = r.nowTotal - r.neuTotal;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-bal`} label="Federal balance to refinance" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <NumberField id={`${p}-r`} label="Current federal rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} />
        <NumberField id={`${p}-y`} label="Years left on your current plan" value={v.y} onChange={set('y')} unit="years" max={30} />
        <NumberField id={`${p}-n`} label="Private rate offered" value={v.n} onChange={set('n')} unit="%" max={25} decimals={2} help="The fixed APR in the lender's offer." />
        <NumberField id={`${p}-t`} label="New term" value={v.t} onChange={set('t')} unit="years" max={30} />
        <NumberField id={`${p}-i`} label="Your AGI (to compare with RAP)" value={v.i} onChange={set('i')} unit="$" max={5000000} />
      </form>
      <Result label={saved >= 0 ? 'Interest saved by refinancing' : 'Extra cost of refinancing'} value={usd(Math.abs(saved))} sub={`${usd(r.neu)} a month instead of ${usd(r.now)}`} methodHref={methodHref} note="A private loan cannot use RAP, IBR, PSLF, federal forgiveness or the federal deferments. Compare before you sign.">
        <Rows rows={[
          ['Total repaid on the federal loans', usd(r.nowTotal)],
          ['Total repaid after refinancing', usd(r.neuTotal)],
          ['RAP payment you would give up, single, no dependent', usd(r.rap)],
        ]} />
      </Result>
    </div>
  );
}
