/** 2026-27 SAI and Pell Grant estimate (FSA SAI and Pell Grant Eligibility Guide, Formulas A, B, C). `mode="pell"` leads with the grant. */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { sai } from '../../lib/engine/sai';
import type { Area } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, AREA_OPTIONS, YES_NO } from './parts';

const SIZES = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
export default function SaiCalculator({ methodHref = '/en/method/', idPrefix = 'sai', mode = 'sai' }: { methodHref?: string; idPrefix?: string; mode?: string }) {
  const [v, set] = useCalc({ dep: '1', m: '1', n: 4, a: 'us', nf: '0', sp: '0', pa: 85000, pt: 6000, pe: 85000, as: 15000, sa: 4000, st: 0, se: 4000, ss: 1000, ia: 32000, it: 1500, ie: 32000, ib: 3000 });
  const dependent = v.dep === '1';
  const married = v.m === '1';
  const r = useMemo(() => sai(dependent
    ? { dependent: true, married, familySize: v.n, area: v.a as Area, nonFiler: v.nf === '1', singleParent: !married && v.sp === '1', filing: married ? 'mfj' : 'single', parents: { agi: v.pa, taxPaid: v.pt, earned: v.pe }, student: { agi: v.sa, taxPaid: v.st, earned: v.se }, assets: v.as, studentAssets: v.ss }
    : { dependent: false, married, familySize: v.n, area: v.a as Area, nonFiler: v.nf === '1', singleParent: !married && v.sp === '1', filing: married ? 'mfj' : 'single', student: { agi: v.ia, taxPaid: v.it, earned: v.ie }, assets: v.ib }), [v, dependent, married]);
  const p = idPrefix;
  const who = dependent ? 'parents' : 'you (and spouse)';
  const pellFirst = mode === 'pell';
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Toggle id={`${p}-dep`} label="Dependent student (parents on the FAFSA)?" value={v.dep} onChange={set('dep')} options={YES_NO} />
        <Toggle id={`${p}-m`} label={dependent ? 'Parents married or living together?' : 'Are you married?'} value={v.m} onChange={set('m')} options={YES_NO} />
        <SelectField id={`${p}-n`} label="Family size" value={String(v.n)} onChange={(x) => set('n')(Number(x))} options={SIZES} help={dependent ? 'Student, parents and the people they support.' : 'You, a spouse and the people you support.'} />
        <SelectField id={`${p}-a`} label="State of legal residence" value={v.a} onChange={set('a')} options={AREA_OPTIONS} />
        <Toggle id={`${p}-nf`} label={`Did ${who} skip filing a 2024 tax return?`} value={v.nf} onChange={set('nf')} options={YES_NO} />
        {!married && <Toggle id={`${p}-sp`} label="Single parent (head of household or EITC)?" value={v.sp} onChange={set('sp')} options={YES_NO} />}
        {dependent ? (<>
          <NumberField id={`${p}-pa`} label="Parents’ 2024 AGI" value={v.pa} onChange={set('pa')} unit="$" max={5000000} help="Form 1040 line 11, tax year 2024." />
          <NumberField id={`${p}-pt`} label="Parents’ 2024 income tax paid" value={v.pt} onChange={set('pt')} unit="$" max={2000000} help="Federal income tax on the 2024 return." />
          <NumberField id={`${p}-pe`} label="Parents’ income earned from work" value={v.pe} onChange={set('pe')} unit="$" max={5000000} />
          <NumberField id={`${p}-as`} label="Parents’ cash, savings and investments" value={v.as} onChange={set('as')} unit="$" max={10000000} help="Not the home you live in or retirement accounts." />
          <NumberField id={`${p}-sa`} label="Student’s 2024 AGI" value={v.sa} onChange={set('sa')} unit="$" max={1000000} />
          <NumberField id={`${p}-se`} label="Student’s earnings from work" value={v.se} onChange={set('se')} unit="$" max={1000000} />
          <NumberField id={`${p}-ss`} label="Student’s savings" value={v.ss} onChange={set('ss')} unit="$" max={5000000} />
        </>) : (<>
          <NumberField id={`${p}-ia`} label="Your (and spouse’s) 2024 AGI" value={v.ia} onChange={set('ia')} unit="$" max={5000000} />
          <NumberField id={`${p}-it`} label="2024 income tax paid" value={v.it} onChange={set('it')} unit="$" max={2000000} />
          <NumberField id={`${p}-ie`} label="Income earned from work" value={v.ie} onChange={set('ie')} unit="$" max={5000000} />
          <NumberField id={`${p}-ib`} label="Cash, savings and investments" value={v.ib} onChange={set('ib')} unit="$" max={10000000} />
        </>)}
      </form>
      <Result label={pellFirst ? 'Estimated Pell Grant, full time, 2026-27' : 'Estimated Student Aid Index 2026-27'} value={pellFirst ? usd(r.pell) : r.sai.toLocaleString('en-US')} sub={pellFirst ? `SAI ${r.sai.toLocaleString('en-US')} · ${r.pellNote}` : `Pell Grant estimate: ${usd(r.pell)} (${r.pellNote})`} methodHref={methodHref}
        note={`Formula ${r.formula} of the 2026-27 FSA guide, with 2024 tax data and 2024 poverty guidelines. Maximum Pell ${usd(P.pell.max)}; your school sets the award by enrollment and cost.`}>
        <Rows rows={[
          ...r.parts.map(([l, x]) => [l, x < 0 ? `−${usd(-x)}` : usd(x)] as [string, string]),
          ['Maximum-Pell income line (AGI at or under)', usd(r.thresholds.max)],
          ['Minimum-Pell income line', usd(r.thresholds.min)],
        ]} />
      </Result>
    </div>
  );
}
