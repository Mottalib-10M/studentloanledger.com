/** PSLF calculator: payments left, what you pay until then and what is forgiven (34 CFR 685.219, HEA 455(m)). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { rapPayment, ibrPayment, pslfProjection, tieredStandard, standard10 } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, DEP_OPTIONS, YES_NO, ym } from './parts';

export default function PslfCalculator({ methodHref = '/en/method/', idPrefix = 'pslf', balance = 75000, agi = 58000, made = 36 }: { methodHref?: string; idPrefix?: string; balance?: number; agi?: number; made?: number }) {
  const [v, set] = useCalc({ b: balance, r: 6.6, i: agi, d: 0, q: made, n: '0', o: '0' });
  const r = useMemo(() => {
    const rap = rapPayment({ agi: v.i, dependents: v.d }).payment;
    const ibr = v.n === '1' ? null : ibrPayment({ agi: v.i, familySize: 1 + v.d, newBorrower: v.o === '0', balance: v.b, rate: v.r }).payment;
    const onRap = pslfProjection({ balance: v.b, rate: v.r, payment: rap, madeSoFar: v.q });
    const onIbr = ibr === null ? null : pslfProjection({ balance: v.b, rate: v.r, payment: ibr, madeSoFar: v.q });
    const tier = tieredStandard(v.b, v.r); const std = standard10(v.b, v.r);
    return { rap, ibr, onRap, onIbr, tier, std };
  }, [v]);
  const p = idPrefix;
  const best = r.onIbr && r.onIbr.paid < r.onRap.paid ? { name: 'IBR', x: r.onIbr, pay: r.ibr! } : { name: 'RAP', x: r.onRap, pay: r.rap };
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-q`} label="Qualifying payments already counted" value={v.q} onChange={set('q')} unit="payments" max={120} help={`PSLF forgives after ${P.pslf.payments}.`} />
        <NumberField id={`${p}-bal`} label="Direct Loan balance" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} />
        <NumberField id={`${p}-agi`} label="Your AGI" value={v.i} onChange={set('i')} unit="$" max={5000000} />
        <SelectField id={`${p}-dep`} label="Dependents" value={String(v.d)} onChange={(x) => set('d')(Number(x))} options={DEP_OPTIONS} />
        <Toggle id={`${p}-new`} label="Any loan disbursed on or after July 1, 2026?" value={v.n} onChange={set('n')} options={YES_NO} />
        <Toggle id={`${p}-old`} label="Owed a federal loan before July 1, 2014?" value={v.o} onChange={set('o')} options={YES_NO} />
      </form>
      <Result label="Projected tax-free PSLF forgiveness" value={usd(best.x.forgiven)} sub={`${best.x.left} payments left (${ym(best.x.left)}) at ${usd(best.pay)} a month on ${best.name}`} methodHref={methodHref}
        note={`Needs full-time work (${P.pslf.hoursPerWeek} hours a week or more) for a qualifying employer each month, Direct Loans and a qualifying plan. The Tiered Standard plan counts only when its payment is at least the 10-year standard amount.`}>
        <Rows rows={[
          ['RAP payment', usd(r.rap)],
          ['Paid until forgiveness on RAP', usd(r.onRap.paid)],
          ...(r.ibr !== null && r.onIbr ? [['IBR payment', usd(r.ibr)] as [string, string], ['Paid until forgiveness on IBR', usd(r.onIbr.paid)] as [string, string]] : []),
          ['10-year standard payment (pays off before 120)', usd(r.std)],
          [`Tiered Standard payment (${r.tier.years} years)`, usd(r.tier.payment)],
        ]} />
      </Result>
    </div>
  );
}
