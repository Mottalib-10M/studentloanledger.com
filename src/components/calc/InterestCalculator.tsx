/** Interest calculator: daily and monthly interest, and what accrues while a loan is in school, grace or forbearance. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import P from '../../data/params-2026.json';
import { dailyInterest, standard10 } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, usd2 } from './parts';

const R = P.rates.current;
export default function InterestCalculator({ methodHref = '/en/method/', idPrefix = 'int', balance = 27000 }: { methodHref?: string; idPrefix?: string; balance?: number }) {
  const [v, set] = useCalc({ b: balance, t: 'undergrad', r: R.undergrad, m: 6 });
  const r = useMemo(() => {
    const day = dailyInterest(v.b, v.r);
    const period = day * 365 / 12 * v.m;
    const pay = standard10(v.b, v.r);
    const firstYearInterest = Array.from({ length: 12 }).reduce<{ b: number; i: number }>((acc) => { const i = acc.b * v.r / 1200; return { b: acc.b + i - pay, i: acc.i + i }; }, { b: v.b, i: 0 }).i;
    return { day, month: day * 365 / 12, period, firstYearInterest, pay };
  }, [v]);
  const p = idPrefix;
  const pick = (t: string) => { set('t')(t); if (t in R) set('r')(R[t as 'undergrad' | 'grad' | 'plus']); };
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-bal`} label="Principal" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <SelectField id={`${p}-type`} label="Loan type (2026-27 rate)" value={v.t} onChange={pick} options={[{ value: 'undergrad', label: `Undergraduate, ${R.undergrad}%` }, { value: 'grad', label: `Graduate unsubsidized, ${R.grad}%` }, { value: 'plus', label: `PLUS, ${R.plus}%` }, { value: 'other', label: 'Other rate' }]} />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={(x) => { set('r')(x); set('t')('other'); }} unit="%" max={25} decimals={2} />
        <NumberField id={`${p}-m`} label="Months without payments" value={v.m} onChange={set('m')} unit="months" max={120} help="School, grace period or forbearance on an unsubsidized loan." />
      </form>
      <Result label="Interest per month" value={usd(r.month)} sub={`About ${usd2(Math.round(r.day * 100) / 100)} a day on ${usd(v.b)}`} methodHref={methodHref} note="Simple interest accrued daily on principal, about the yearly rate ÷ 365 per day; your servicer's daily factor can differ slightly. A subsidized loan does not charge you interest while you are in school at least half time.">
        <Rows rows={[
          [`Interest over ${v.m} months without payments`, usd(r.period)],
          ['10-year standard payment afterwards', usd(r.pay)],
          ['Interest paid in the first year of that plan', usd(r.firstYearInterest)],
        ]} />
      </Result>
    </div>
  );
}
