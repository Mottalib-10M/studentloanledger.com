import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import { GROUPS } from '../lib/topics';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Plan comparator', method: 'How we calculate', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
/** Menus: the calculators of each group first, then its guides. */
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.short, links: [...PAGES.filter((p) => p.group === g.id && p.kind === 'pillar'), ...PAGES.filter((p) => p.group === g.id && p.kind === 'guide')].map((p) => link(p.id, lang)) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: PAGES.filter((p) => p.group === g.id).map((p) => link(p.id, lang)) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** The calculators, in the footer row: each one is one click from anywhere (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => PAGES.filter((p) => p.kind === 'pillar').map((p) => link(p.id, lang));
