/**
 * Shared tools for the mini-simulators (ignored by the registry: "_" prefix).
 * A mini imports the engines and params-2026.json, never src/lib/kit.ts or the routes.
 */
import { formatMoney, formatNumber } from '../format';
import P from '../../data/params-2026.json';
export { pct, ym } from '../fmt';
export { P };
export const usd = (x: number, d = 0) => formatMoney(x, d);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export const sizes = (max = 8) => Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: i === 0 ? '1 person' : `${i + 1} people` }));
export const deps = (max = 6) => Array.from({ length: max + 1 }, (_, i) => ({ value: String(i), label: i === 0 ? 'None' : String(i) }));
export function parseArg<T>(arg: string | undefined, fallback: T): T {
  if (!arg) return fallback;
  try { return JSON.parse(arg) as T; } catch { return fallback; }
}
