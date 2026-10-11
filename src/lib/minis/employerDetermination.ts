/** PSLF credit when an employer loses qualifying status: months before the determination keep their credit (34 CFR 685.219(c)(4)). */
import type { MiniSpec } from '../mini-types';
import { P } from './_kit';
export default (): MiniSpec => ({
  title: 'If your employer lost PSLF status',
  cta: 'Project your PSLF forgiveness',
  ctaHref: '/en/pslf-calculator/',
  inputs: [
    { id: 'a', label: 'Payments already counted', def: 70, unit: 'payments', max: 120 },
    { id: 'b', label: 'Months worked there before the determination', def: 6, unit: 'months', max: 120 },
    { id: 'c', label: 'Months you would stay after it', def: 12, unit: 'months', max: 120 },
  ],
  run: (v) => {
    const kept = Math.min(P.pslf.payments, Math.round(v.a + v.b));
    return { head: ['Payments that keep their credit', String(kept)], rows: [['Months after the determination that count', '0'], ['Payments still needed with a new qualifying employer', String(Math.max(0, P.pslf.payments - kept))], ['Months that would be lost by staying', String(Math.round(v.c))]], note: 'Assumes each month before the determination was otherwise qualifying.' };
  },
});
