/** Repayment Assistance Plan calculator: payment, interest waiver, $50 match and the 360-payment horizon (HEA 455(q), 34 CFR 685.209). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import P from '../../data/params-2026.json';
import { rapPayment, simulateRap, type Filing } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, FILING_OPTIONS, DEP_OPTIONS, ym } from './parts';

export default function RapCalculator({ methodHref = '/en/method/', idPrefix = 'rap', agi = 45000, balance = 35000, dependents = 0, rate = P.rates.current.undergrad }: { methodHref?: string; idPrefix?: string; agi?: number; balance?: number; dependents?: number; rate?: number }) {
  const [v, set] = useCalc({ i: agi, f: 'single', s: 0, d: dependents, b: balance, r: rate, g: 2 });
  const filing = v.f as Filing;
  const pay = useMemo(() => rapPayment({ agi: v.i, dependents: v.d, filing, spouseAgi: v.s }), [v, filing]);
  const sim = useMemo(() => simulateRap({ balance: v.b, rate: v.r, agi: v.i, growth: v.g, dependents: v.d, filing, spouseAgi: v.s }), [v, filing]);
  const interest1 = (v.b * v.r) / 100 / 12;
  const waived1 = Math.max(0, interest1 - pay.payment);
  const toPrincipal1 = Math.max(0, pay.payment - interest1);
  const match1 = toPrincipal1 < P.rap.matchMax ? Math.max(0, Math.min(P.rap.matchMax, pay.payment) - toPrincipal1) : 0;
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-agi`} label="Your adjusted gross income (AGI)" value={v.i} onChange={set('i')} unit="$" max={5000000} help="From your latest federal tax return." />
        <SelectField id={`${p}-fil`} label="Tax filing status" value={v.f} onChange={set('f')} options={FILING_OPTIONS} />
        {filing === 'mfj' && <NumberField id={`${p}-sp`} label="Spouse's AGI" value={v.s} onChange={set('s')} unit="$" max={5000000} help="A joint return puts both incomes in RAP." />}
        <SelectField id={`${p}-dep`} label="Dependents claimed on your return" value={String(v.d)} onChange={(x) => set('d')(Number(x))} options={DEP_OPTIONS} help={`$${P.rap.perDependent} a month less for each.`} />
        <NumberField id={`${p}-bal`} label="Balance of the loans on RAP" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} />
        <NumberField id={`${p}-g`} label="Yearly raise you expect" value={v.g} onChange={set('g')} unit="%" max={15} decimals={1} help="RAP is recalculated every year on your new AGI." />
      </form>
      <Result label="RAP monthly payment" value={usd(pay.payment)} sub={pay.minimumApplied ? `$${P.rap.minPayment} minimum applies` : `${pay.pct === 0 ? `$${P.rap.floorBase} a year` : `${pay.pct}% of ${usd(pay.agi)}`} ÷ 12${v.d ? ` − $${P.rap.perDependent} × ${v.d}` : ''}`} methodHref={methodHref}
        note="One rate applies to the whole AGI, by bracket of $10,000. Waiver and match need an on-time payment each month.">
        <Rows rows={[
          ['Interest charged in month one', usd(interest1)],
          ['Interest waived in month one', usd(waived1)],
          ['Matching principal payment in month one', usd(match1)],
          [sim.paidOff ? 'Paid off after' : 'Forgiven after 360 payments', sim.paidOff ? ym(sim.months) : usd(sim.forgiven)],
          ['Total you pay', usd(sim.totalPaid)],
          ['Interest waived over the plan', usd(sim.interestWaived)],
          ['Matching payments over the plan', usd(sim.matched)],
        ]} />
      </Result>
    </div>
  );
}
