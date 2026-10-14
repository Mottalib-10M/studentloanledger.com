/** Home comparator: RAP, IBR, Tiered Standard and the 10-year plan for one borrower after the 2025 law (engine: lib/engine/loans.ts). */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import P from '../../data/params-2026.json';
import { comparePlans, type Area, type Filing } from '../../lib/engine/loans';
import { useCalc } from './use-calc';
import { Result, Rows, Bars, usd, AREA_OPTIONS, FILING_OPTIONS, DEP_OPTIONS, YES_NO, PLAN_LABEL, ym } from './parts';

interface Props { methodHref?: string; idPrefix?: string; balance?: number; agi?: number; rate?: number; newLoan?: string }
export default function PlanComparator({ methodHref = '/en/method/', idPrefix = 'cmp', balance = 38000, agi = 52000, rate = P.rates.current.undergrad, newLoan = '0' }: Props) {
  const [v, set] = useCalc({ b: balance, r: rate, i: agi, f: 'single', s: 0, d: 0, a: 'us', n: newLoan, o: '0', g: 2 });
  const filing = v.f as Filing;
  const size = 1 + v.d + (filing === 'mfj' ? 1 : 0);
  const res = useMemo(() => comparePlans({ balance: v.b, rate: v.r, agi: v.i, familySize: size, dependents: v.d, area: v.a as Area, filing, spouseAgi: filing === 'mfj' ? v.s : 0, growth: v.g, newLoanAfterJuly2026: v.n === '1', newBorrower2014: v.o === '0' }), [v, size, filing]);
  const minTotal = Math.min(...res.plans.map((p) => p.totalPaid));
  const minPay = Math.min(...res.plans.map((p) => p.firstPayment));
  const rap = res.plans.find((p) => p.plan === 'rap')!;
  const p = idPrefix;
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id={`${p}-bal`} label="Federal loan balance today" value={v.b} onChange={set('b')} unit="$" max={2000000} help="All your Direct Loans, principal plus unpaid interest." />
        <NumberField id={`${p}-rate`} label="Interest rate (weighted average)" value={v.r} onChange={set('r')} unit="%" max={20} decimals={2} help={`New 2026-27 loans: ${P.rates.current.undergrad}% undergraduate, ${P.rates.current.grad}% graduate.`} />
        <NumberField id={`${p}-agi`} label="Your adjusted gross income (AGI)" value={v.i} onChange={set('i')} unit="$" max={5000000} help="Line 11 of your latest Form 1040." />
        <SelectField id={`${p}-fil`} label="Tax filing status" value={v.f} onChange={set('f')} options={FILING_OPTIONS} />
        {filing === 'mfj' && <NumberField id={`${p}-sp`} label="Spouse's AGI" value={v.s} onChange={set('s')} unit="$" max={5000000} help="Counted by RAP and IBR on a joint return." />}
        <SelectField id={`${p}-dep`} label="Dependents you claim" value={String(v.d)} onChange={(x) => set('d')(Number(x))} options={DEP_OPTIONS} help="RAP takes $50 a month off per dependent." />
        <SelectField id={`${p}-area`} label="Where you live" value={v.a} onChange={set('a')} options={AREA_OPTIONS} help="IBR uses the poverty guideline of your state group." />
        <Toggle id={`${p}-new`} label="Any loan disbursed on or after July 1, 2026?" value={v.n} onChange={set('n')} options={YES_NO} />
        <Toggle id={`${p}-old`} label="Owed a federal loan before July 1, 2014?" value={v.o} onChange={set('o')} options={YES_NO} />
        <NumberField id={`${p}-g`} label="Yearly raise you expect" value={v.g} onChange={set('g')} unit="%" max={15} decimals={1} help="Payments on RAP and IBR follow your income each year." />
      </form>
      <Result label="Your monthly payment on RAP" value={usd(rap.firstPayment)} sub={rap.paidOff ? `Paid off in ${ym(rap.months)} with on-time payments` : `Balance left after 360 payments is forgiven: ${usd(rap.forgiven)}`} methodHref={methodHref}
        note={`${v.n === '1' ? 'A loan made on or after July 1, 2026 limits all your loans to RAP and Tiered Standard.' : 'IBR and the 10-year plan stay open for loans made before July 1, 2026.'} Every payment assumed on time; AGI grows by the raise you entered.`}>
        <Bars items={res.plans.map((x) => ({ label: PLAN_LABEL[x.plan], value: x.firstPayment, best: x.firstPayment === minPay }))} />
        <p className="mt-4 text-sm font-medium text-navy-700">Total you would pay over the life of the plan</p>
        <Bars items={res.plans.map((x) => ({ label: PLAN_LABEL[x.plan], value: x.totalPaid, note: x.paidOff ? `· ${ym(x.months)}` : `· ${usd(x.forgiven)} forgiven`, best: x.totalPaid === minTotal }))} />
        <Rows rows={[
          ['Tiered Standard term for this balance', `${res.tierYears} years`],
          ['RAP interest waived over the plan', usd(rap.interestWaived)],
          ['RAP matching principal payments', usd(rap.matched)],
          ['Household size used for IBR', String(size)],
        ]} />
      </Result>
    </div>
  );
}
