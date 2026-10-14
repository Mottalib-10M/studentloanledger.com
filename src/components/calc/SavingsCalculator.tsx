/** 529 projection and college savings goal (assumed returns are the user's own hypothesis, not a forecast). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import P from '../../data/params-2026.json';
import { futureValue } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd } from './parts';

export function S529({ methodHref = '/en/method/', idPrefix = 's529' }: { methodHref?: string; idPrefix?: string }) {
  const [v, set] = useCalc({ s: 5000, m: 250, y: 12, r: 5 });
  const fv = useMemo(() => futureValue(v.s, v.m, v.y, v.r), [v]);
  const put = v.s + v.m * 12 * v.y;
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-s`} label="In the 529 today" value={v.s} onChange={set('s')} unit="$" max={5000000} />
        <NumberField id={`${p}-m`} label="Monthly contribution" value={v.m} onChange={set('m')} unit="$" max={100000} />
        <NumberField id={`${p}-y`} label="Years until the money is used" value={v.y} onChange={set('y')} unit="years" max={40} />
        <NumberField id={`${p}-r`} label="Yearly return you assume" value={v.r} onChange={set('r')} unit="%" max={15} decimals={1} help="Your own hypothesis; markets can lose value." />
      </form>
      <Result label="Projected 529 balance" value={usd(fv)} sub={`${usd(put)} contributed, ${usd(Math.max(0, fv - put))} of assumed growth`} methodHref={methodHref}
        note={`Growth is tax-free when withdrawals pay qualified expenses (26 U.S.C. 529). K-12 tuition: up to ${usd(P.s529.k12New)} a year from 2026.`}>
        <Rows rows={[
          ['Contributions', usd(put)],
          ['Assumed growth', usd(Math.max(0, fv - put))],
          [`Gift tax annual exclusion 2026, per donor and child`, usd(P.s529.giftExclusion)],
        ]} />
      </Result>
    </div>
  );
}

export function CollegeSavings({ methodHref = '/en/method/', idPrefix = 'cs' }: { methodHref?: string; idPrefix?: string }) {
  const [v, set] = useCalc({ c: 30000, n: 4, y: 10, i: 3, r: 5, s: 10000 });
  const r = useMemo(() => {
    const yearsOut = Math.max(0, v.y);
    let goal = 0; for (let k = 0; k < Math.max(1, Math.round(v.n)); k++) goal += v.c * Math.pow(1 + v.i / 100, yearsOut + k);
    const fromSaved = futureValue(v.s, 0, yearsOut, v.r);
    const gap = Math.max(0, goal - fromSaved);
    const unit = futureValue(0, 1, yearsOut, v.r);
    return { goal, fromSaved, gap, monthly: unit > 0 ? gap / unit : gap };
  }, [v]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-c`} label="Yearly cost today (net price)" value={v.c} onChange={set('c')} unit="$" max={500000} help="From the school's net price calculator." />
        <NumberField id={`${p}-n`} label="Years of college" value={v.n} onChange={set('n')} unit="years" max={8} />
        <NumberField id={`${p}-y`} label="Years until college starts" value={v.y} onChange={set('y')} unit="years" max={25} />
        <NumberField id={`${p}-i`} label="Yearly cost increase you assume" value={v.i} onChange={set('i')} unit="%" max={15} decimals={1} />
        <NumberField id={`${p}-r`} label="Yearly return you assume" value={v.r} onChange={set('r')} unit="%" max={15} decimals={1} />
        <NumberField id={`${p}-s`} label="Saved so far" value={v.s} onChange={set('s')} unit="$" max={5000000} />
      </form>
      <Result label="Monthly saving needed" value={usd(r.monthly)} sub={`To cover ${usd(r.goal)} of future costs`} methodHref={methodHref} note="Every rate here is your hypothesis. The goal counts each year of college at its own future price.">
        <Rows rows={[
          ['Future cost of all years', usd(r.goal)],
          ['What today’s savings may grow to', usd(r.fromSaved)],
          ['Gap to fill with monthly saving', usd(r.gap)],
        ]} />
      </Result>
    </div>
  );
}
