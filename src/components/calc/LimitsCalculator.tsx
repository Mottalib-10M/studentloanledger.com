/** How much you can borrow in 2026-27: annual, aggregate and lifetime limits (34 CFR 685.203, HEA 455(a)(4)-(6)). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { annualLimit } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, YES_NO } from './parts';

const KIND = [{ value: 'dep', label: 'Dependent undergraduate' }, { value: 'ind', label: 'Independent undergraduate' }, { value: 'grad', label: 'Graduate student (master’s, PhD)' }, { value: 'prof', label: 'Professional student (law, medicine...)' }];
export default function LimitsCalculator({ methodHref = '/en/method/', idPrefix = 'lim', kind = 'dep' }: { methodHref?: string; idPrefix?: string; kind?: string }) {
  const [v, set] = useCalc({ k: kind, y: 1, a: 0, l: 0, e: '0', c: 100, t: '0' });
  const undergrad = v.k === 'dep' || v.k === 'ind';
  const r = useMemo(() => {
    const lim = annualLimit(v.k as 'dep' | 'ind' | 'grad' | 'prof', v.y);
    const part = Math.min(100, Math.max(1, v.c)) / 100;
    const legacy = !undergrad && v.e === '1';
    const annual = legacy ? P.limits.gradOld.annualUnsub : Math.round(lim.total * part);
    const aggLeft = Math.max(0, (legacy ? P.limits.gradOld.aggregate : lim.aggregate) - v.a);
    const lifeLeft = Math.max(0, P.limits.lifetime - v.l);
    return { lim, annual, can: Math.max(0, Math.min(annual, aggLeft, lifeLeft)), aggLeft, lifeLeft, legacy };
  }, [v, undergrad]);
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id={`${p}-k`} label="You are" value={v.k} onChange={set('k')} options={KIND} />
        {undergrad && <SelectField id={`${p}-y`} label="Year in school" value={String(v.y)} onChange={(x) => set('y')(Number(x))} options={[{ value: '1', label: 'First year' }, { value: '2', label: 'Second year' }, { value: '3', label: 'Third year or later' }]} />}
        {!undergrad && <Toggle id={`${p}-e`} label="Enrolled with a federal loan for this program by June 30, 2026?" value={v.e} onChange={set('e')} options={YES_NO} />}
        {!r.legacy && <NumberField id={`${p}-c`} label="Enrollment, share of full time" value={v.c} onChange={set('c')} unit="%" max={100} help="Less than full time reduces the annual limit in proportion." />}
        <NumberField id={`${p}-a`} label={undergrad ? 'Already borrowed as an undergraduate' : 'Already borrowed for graduate or professional study'} value={v.a} onChange={set('a')} unit="$" max={1000000} />
        <NumberField id={`${p}-l`} label="All federal student loans borrowed so far" value={v.l} onChange={set('l')} unit="$" max={1000000} help={`Lifetime cap ${usd(P.limits.lifetime)}, parent PLUS excluded.`} />
      </form>
      <Result label="Federal Direct Loans you can borrow this year" value={usd(r.can)} sub={undergrad ? `Of which subsidized: up to ${usd(r.lim.sub)}, if you show financial need` : r.legacy ? 'Prior limits kept for up to 3 academic years (interim exception)' : 'Unsubsidized only; Grad PLUS closed to new periods from July 1, 2026'} methodHref={methodHref}
        note="Also capped by your school's cost of attendance minus other aid, and a school may set a lower limit for a program.">
        <Rows rows={[
          ['Annual limit for you', usd(r.annual)],
          ['Aggregate room left', usd(r.aggLeft)],
          ['Lifetime room left', usd(r.lifeLeft)],
          ...(v.k === 'dep' ? [['Parent PLUS on top, per year / in total', `${usd(P.limits.parentPlus.annual)} / ${usd(P.limits.parentPlus.aggregate)}`] as [string, string]] : []),
        ]} />
      </Result>
    </div>
  );
}
