/** Years of professional-school borrowing before the federal caps bind (HEA 455(a)(4); 34 CFR 685.203(j)). */
import type { MiniSpec } from '../mini-types';
import { P, usd, num } from './_kit';
const L = P.limits;
export default (): MiniSpec => ({
  title: 'How long the professional caps last',
  cta: 'Compare repayment plans on that balance',
  ctaHref: '/en/',
  inputs: [
    { id: 'yr', label: 'Federal loans you plan each year', def: 50000, unit: '$', max: 500000 },
    { id: 'gp', label: 'Graduate or professional loans already borrowed', def: 0, unit: '$', max: 1000000 },
    { id: 'ug', label: 'Undergraduate federal loans', def: 24000, unit: '$', max: 1000000 },
  ],
  run: (v) => {
    const yearly = Math.min(Math.max(0, v.yr), L.professional.annual);
    const roomProf = Math.max(0, L.professional.aggregate - v.gp);
    const roomLife = Math.max(0, L.lifetime - v.gp - v.ug);
    const room = Math.min(roomProf, roomLife);
    const years = yearly > 0 ? room / yearly : 0;
    return {
      head: ['Years of borrowing left', yearly > 0 ? num(years, 1) : '0'],
      rows: [
        ['Room under the professional aggregate', usd(roomProf)],
        ['Room under the lifetime limit', usd(roomLife)],
        ['Limit that binds first', roomLife < roomProf ? 'Lifetime limit' : 'Professional aggregate'],
        ['Yearly amount used', usd(yearly)],
      ],
      note: `Annual limit ${usd(L.professional.annual)}; graduate and professional loans share one ${usd(L.professional.aggregate)} cap.`,
    };
  },
});
