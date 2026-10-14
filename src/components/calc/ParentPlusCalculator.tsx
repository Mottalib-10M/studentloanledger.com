/** Parent PLUS calculator: the 2026 caps ($20,000 a year, $65,000 per student) and the cost on the fixed plans. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import P from '../../data/params-2026.json';
import { tieredStandard, standard10 } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd } from './parts';

export default function ParentPlusCalculator({ methodHref = '/en/method/', idPrefix = 'pp' }: { methodHref?: string; idPrefix?: string }) {
  const [v, set] = useCalc({ a: 15000, y: 4, s: 0, r: P.rates.current.plus });
  const r = useMemo(() => {
    const perYear = Math.min(v.a, P.limits.parentPlus.annual);
    const room = Math.max(0, P.limits.parentPlus.aggregate - v.s);
    const total = Math.min(perYear * Math.max(1, Math.round(v.y)), room);
    const tier = tieredStandard(total, v.r);
    return { perYear, total, room, tier, std: standard10(total, v.r), interest: tier.payment * tier.months - total };
  }, [v]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-a`} label="Parent PLUS you want each year" value={v.a} onChange={set('a')} unit="$" max={200000} help={`Capped at ${usd(P.limits.parentPlus.annual)} per student for all parents.`} />
        <NumberField id={`${p}-y`} label="Years of college to finance" value={v.y} onChange={set('y')} unit="years" max={8} />
        <NumberField id={`${p}-s`} label="Parent PLUS already borrowed for this student" value={v.s} onChange={set('s')} unit="$" max={500000} />
        <NumberField id={`${p}-r`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} help={`Loans first disbursed July 1, 2026 to June 30, 2027: ${P.rates.current.plus}%.`} />
      </form>
      <Result label="Total parent PLUS you could borrow" value={usd(r.total)} sub={`${usd(r.tier.payment)} a month on Tiered Standard (${r.tier.years} years)`} methodHref={methodHref}
        note="A parent PLUS loan made on or after July 1, 2026 is repaid on the Tiered Standard plan; RAP is not open to it. Loan fees and interest accrued before repayment are not included.">
        <Rows rows={[
          ['Borrowed each year after the cap', usd(r.perYear)],
          ['Room left under the per-student total', usd(r.room)],
          ['Interest over the Tiered Standard term', usd(r.interest)],
          ['Payment on a 10-year schedule', usd(r.std)],
        ]} />
      </Result>
    </div>
  );
}
