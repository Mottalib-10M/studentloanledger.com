/** Student loan interest deduction, tax year 2026 (26 U.S.C. 221; Rev. Proc. 2025-32 sec. 4.29). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import P from '../../data/params-2026.json';
import { interestDeduction, type Filing } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, FILING_OPTIONS } from './parts';

const BRACKETS = [10, 12, 22, 24, 32, 35, 37].map((x) => ({ value: String(x), label: `${x}%` }));
export default function DeductionCalculator({ methodHref = '/en/method/', idPrefix = 'ded' }: { methodHref?: string; idPrefix?: string }) {
  const [v, set] = useCalc({ i: 1800, m: 72000, f: 'single', t: '22' });
  const r = useMemo(() => interestDeduction(v.i, v.m, v.f as Filing), [v]);
  const saved = (r.deduction * Number(v.t)) / 100;
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-i`} label="Student loan interest paid in 2026" value={v.i} onChange={set('i')} unit="$" max={1000000} help="Box 1 of the Form 1098-E from your servicer." />
        <NumberField id={`${p}-m`} label="Modified AGI" value={v.m} onChange={set('m')} unit="$" max={5000000} help="AGI before this deduction, plus excluded foreign income." />
        <SelectField id={`${p}-f`} label="Filing status" value={v.f} onChange={set('f')} options={FILING_OPTIONS} />
        <SelectField id={`${p}-t`} label="Your top federal tax bracket" value={v.t} onChange={set('t')} options={BRACKETS} />
      </form>
      <Result label="Deduction for tax year 2026" value={usd(r.deduction)} sub={r.allowed ? `About ${usd(saved)} less federal tax at ${v.t}%` : 'Not available on a married filing separately return'} methodHref={methodHref}
        note={`Up to ${usd(P.deduction.max)}, reduced between ${usd(r.start || P.deduction.single[0])} and ${usd(r.end || P.deduction.single[1])} of modified AGI; claimed without itemizing.`}>
        <Rows rows={[
          ['Interest counted (capped)', usd(Math.min(v.i, P.deduction.max))],
          ['Phase-out reduction', usd(r.reduction)],
          ['Phase-out range for your status', r.allowed ? `${usd(r.start)} to ${usd(r.end)}` : 'not allowed'],
        ]} />
      </Result>
    </div>
  );
}
