/**
 * Calculator state with a shareable link (RECETTE §17.5, §18.1): first render = the build defaults,
 * the link parameters are applied after mount, and the address changes only after an interaction.
 * Every value is a string or a number keyed by a short URL name.
 */
import { useEffect, useState } from 'react';
import { readParams, updateURL } from '../../lib/url-state';

export function useCalc<T extends Record<string, string | number>>(defaults: T) {
  const [v, setV] = useState<T>(defaults);
  useEffect(() => {
    const u = readParams(window.location.search);
    const next = { ...defaults };
    for (const k of Object.keys(defaults) as Array<keyof T>) {
      const raw = u.get(String(k)); if (raw === null) continue;
      if (typeof defaults[k] === 'number') { const n = parseFloat(raw); if (!isNaN(n)) (next[k] as number) = n; } else (next[k] as string) = raw;
    }
    setV(next);
  }, []);
  useEffect(() => { updateURL(Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== defaults[k as keyof T]))); }, [v]);
  const set = <K extends keyof T>(k: K) => (x: T[K]) => setV((o) => ({ ...o, [k]: x }));
  return [v, set] as const;
}
