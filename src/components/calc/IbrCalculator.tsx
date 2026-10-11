/** Income-Based Repayment calculator after the 2025 law (HEA 493C, 34 CFR 685.209(f)(2)-(3)). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { ibrPayment, simulateIbr, rapPayment, type Area, type Filing } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, usd, AREA_OPTIONS, FILING_OPTIONS, YES_NO, ym } from './parts';

const SIZES = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: i === 0 ? '1 (just you)' : String(i + 1) }));
export default function IbrCalculator({ methodHref = '/en/method/', idPrefix = 'ibr', agi = 55000, balance = 45000, rate = 6.5 }: { methodHref?: string; idPrefix?: string; agi?: number; balance?: number; rate?: number }) {
  const [v, set] = useCalc({ i: agi, f: 'single', s: 0, n: 1, a: 'us', o: '0', b: balance, r: rate, g: 2 });
  const filing = v.f as Filing;
  const pay = useMemo(() => ibrPayment({ agi: v.i, familySize: v.n, area: v.a as Area, newBorrower: v.o === '0', filing, spouseAgi: v.s, balance: v.b, rate: v.r }), [v, filing]);
  const sim = useMemo(() => simulateIbr({ balance: v.b, rate: v.r, agi: v.i, growth: v.g, familySize: v.n, area: v.a as Area, newBorrower: v.o === '0', filing, spouseAgi: v.s }), [v, filing]);
  const rap = rapPayment({ agi: v.i, dependents: Math.max(0, v.n - 1 - (filing === 'mfj' ? 1 : 0)), filing, spouseAgi: v.s }).payment;
  const interest1 = (v.b * v.r) / 100 / 12;
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-agi`} label="Your adjusted gross income (AGI)" value={v.i} onChange={set('i')} unit="$" max={5000000} help="From your latest federal tax return." />
        <SelectField id={`${p}-fil`} label="Tax filing status" value={v.f} onChange={set('f')} options={FILING_OPTIONS} />
        {filing === 'mfj' && <NumberField id={`${p}-sp`} label="Spouse's AGI" value={v.s} onChange={set('s')} unit="$" max={5000000} />}
        <SelectField id={`${p}-size`} label="Family size" value={String(v.n)} onChange={(x) => set('n')(Number(x))} options={SIZES} help="You, a spouse on a joint return, and the people you support." className="lg:col-span-2" />
        <SelectField id={`${p}-area`} label="Where you live" value={v.a} onChange={set('a')} options={AREA_OPTIONS} />
        <Toggle id={`${p}-old`} label="Owed a federal loan before July 1, 2014?" value={v.o} onChange={set('o')} options={YES_NO} />
        <NumberField id={`${p}-bal`} label="Balance of eligible loans" value={v.b} onChange={set('b')} unit="$" max={2000000} />
        <NumberField id={`${p}-rate`} label="Interest rate" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} />
        <NumberField id={`${p}-g`} label="Yearly raise you expect" value={v.g} onChange={set('g')} unit="%" max={15} decimals={1} />
      </form>
      <Result label="IBR monthly payment" value={usd(pay.payment)} sub={pay.capped ? 'Capped at the 10-year standard payment' : `${pay.pct}% of ${usd(pay.discretionary)} above the income line, ÷ 12`} methodHref={methodHref}
        note={`IBR is closed to loans made on or after July 1, 2026. Unpaid interest keeps accruing on IBR. ${v.o === '0' ? `New borrower: ${P.ibr.newPct}%, forgiveness after 20 years.` : `Borrower before July 2014: ${P.ibr.oldPct}%, forgiveness after 25 years.`}`}>
        <Rows rows={[
          ['Income line (150% of the 2026 poverty guideline)', usd(pay.line)],
          ['Cap: 10-year standard payment', usd(pay.cap)],
          ['Interest charged in month one', usd(interest1)],
          ['Same borrower on RAP', usd(rap)],
          [sim.paidOff ? 'Paid off after' : `Forgiven after ${sim.months} payments`, sim.paidOff ? ym(sim.months) : usd(sim.forgiven)],
          ['Total you pay on IBR', usd(sim.totalPaid)],
        ]} />
      </Result>
    </div>
  );
}
