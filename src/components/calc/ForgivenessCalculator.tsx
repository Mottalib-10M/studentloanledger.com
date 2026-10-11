/** Forgiveness calculator: when and how much each route forgives (RAP 360 payments, IBR 240/300, PSLF 120). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { simulateRap, simulateIbr, rapPayment, pslfProjection } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, DEP_OPTIONS, YES_NO, ym } from './parts';

export default function ForgivenessCalculator({ methodHref = '/en/method/', idPrefix = 'fgv', balance = 90000, agi = 48000 }: { methodHref?: string; idPrefix?: string; balance?: number; agi?: number }) {
  const [v, set] = useCalc({ b: balance, r: 6.8, i: agi, d: 1, o: '0', n: '0', s: '0', q: 0, g: 2 });
  const size = 1 + v.d;
  const r = useMemo(() => {
    const rap = simulateRap({ balance: v.b, rate: v.r, agi: v.i, growth: v.g, dependents: v.d });
    const ibr = v.n === '1' ? null : simulateIbr({ balance: v.b, rate: v.r, agi: v.i, growth: v.g, familySize: size, newBorrower: v.o === '0' });
    const pslf = v.s === '1' ? pslfProjection({ balance: v.b, rate: v.r, payment: rapPayment({ agi: v.i, dependents: v.d }).payment, madeSoFar: v.q }) : null;
    return { rap, ibr, pslf };
  }, [v, size]);
  const p = idPrefix;
  const rows: Array<[string, string]> = [
    ['RAP: forgiven after 360 payments', r.rap.paidOff ? `nothing, paid off in ${ym(r.rap.months)}` : usd(r.rap.forgiven)],
  ];
  if (r.ibr) rows.push([`IBR: forgiven after ${r.ibr.months} payments`, r.ibr.paidOff ? `nothing, paid off in ${ym(r.ibr.months)}` : usd(r.ibr.forgiven)]);
  if (r.pslf) rows.push([`PSLF: ${r.pslf.left} payments left on RAP`, usd(r.pslf.forgiven)]);
  const head = r.pslf ? r.pslf.forgiven : Math.max(r.rap.forgiven, r.ibr?.forgiven ?? 0);
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-bal`} label="Federal loan balance" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} />
        <NumberField id={`${p}-agi`} label="Your AGI" value={v.i} onChange={set('i')} unit="$" max={5000000} />
        <SelectField id={`${p}-dep`} label="Dependents" value={String(v.d)} onChange={(x) => set('d')(Number(x))} options={DEP_OPTIONS} />
        <Toggle id={`${p}-pslf`} label="Full-time public service job?" value={v.s} onChange={set('s')} options={YES_NO} />
        {v.s === '1' && <NumberField id={`${p}-q`} label="PSLF payments already counted" value={v.q} onChange={set('q')} unit="payments" max={120} help="From your PSLF tracker on StudentAid.gov." />}
        <Toggle id={`${p}-new`} label="Any loan disbursed on or after July 1, 2026?" value={v.n} onChange={set('n')} options={YES_NO} />
        <Toggle id={`${p}-old`} label="Owed a federal loan before July 1, 2014?" value={v.o} onChange={set('o')} options={YES_NO} />
        <NumberField id={`${p}-g`} label="Yearly raise you expect" value={v.g} onChange={set('g')} unit="%" max={15} decimals={1} />
      </form>
      <Result label={r.pslf ? 'Projected PSLF forgiveness' : 'Largest projected forgiveness'} value={usd(head)} sub={r.pslf ? `After ${ym(r.pslf.left)} more of qualifying payments on RAP` : 'Income-driven forgiveness needs 20 to 30 years of payments'} methodHref={methodHref}
        note={`PSLF forgiveness is tax-free under 26 U.S.C. 108(f)(1). Since January 1, 2026 the broad federal exclusion for other forgiveness is gone (Public Law 119-21 sec. 70119). Payments assumed on time.`}>
        <Rows rows={rows} />
      </Result>
    </div>
  );
}
