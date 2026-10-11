/** SAI with and without a family business or farm in net worth (Table A3 vs HEA 480(f)(2) as amended by sec. 80001). */
import type { MiniSpec } from '../mini-types';
import { sai, businessAdjusted } from '../engine/sai';
import { usd } from './_kit';
export default (): MiniSpec => ({
  title: 'What the business exclusion is worth on your FAFSA',
  cta: 'Run the full SAI calculator',
  ctaHref: '/en/sai-calculator/',
  inputs: [
    { id: 'agi', label: 'Parents’ adjusted gross income', def: 82000, unit: '$', max: 5000000 },
    { id: 'nw', label: 'Net worth of the business or farm', def: 260000, unit: '$', max: 50000000 },
    { id: 'sav', label: 'Parents’ savings and investments', def: 12000, unit: '$', max: 10000000 },
  ],
  run: (v) => {
    const base = { dependent: true, married: true, familySize: 4, filing: 'mfj' as const, parents: { agi: v.agi, taxPaid: Math.round(v.agi * 0.05), earned: v.agi }, student: { agi: 0, taxPaid: 0, earned: 0 }, assets: v.sav };
    const out = sai(base); const inn = sai({ ...base, businessNetWorth: v.nw });
    return {
      head: ['SAI lowered by the exclusion', (inn.sai - out.sai).toLocaleString('en-US')],
      rows: [['SAI, business excluded (2026-27)', out.sai.toLocaleString('en-US')], ['SAI if it were counted', inn.sai.toLocaleString('en-US')], ['Amount the business table would add', usd(businessAdjusted(v.nw))], ['Pell, excluded vs counted', `${usd(out.pell)} vs ${usd(inn.pell)}`]],
      note: 'Family of four, married parents, tax paid of 5% of AGI. Only a qualifying family business or farm is excluded.',
    };
  },
});
