/**
 * One page = ONE content file `src/content/pages/<id>.ts` (CONTRIBUTING-PAGES.md).
 * Routes, menus, footer, sitemap, schemas, llms.txt and internal links read these files alone.
 */
import type { Group } from './topics';
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

/** Writing tools passed to every body: links, formatters, tables, official links, and the data kit. */
export interface Helpers extends Kit {
  /** Internal link by page id. An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Journal-style table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to an official source of params-2026.json (key) with optional text. */
  src: (key: string, text?: string) => string;
  /** Ruled box in the press style. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator: `<!--mini:kind|arg-->` rendered as an island. */
  mini: (kind: string, arg?: unknown) => string;
}

export type ToolKind = 'compare' | 'payment' | 'rap' | 'ibr' | 'payoff' | 'interest' | 'refi' | 'forgive' | 'pslf' | 'limits' | 'parentplus' | 's529' | 'savings' | 'sai' | 'pell' | 'deduction';

export interface PageDef {
  id: string;
  group: Group;
  /** pillar: page built around a full calculator; guide: one question, its mini-simulator, 1,000+ words. */
  kind: 'pillar' | 'guide';
  order: number;
  /** URL segment, lowercase and dashes, no year (= src/lib/planned.ts). */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, 2026 included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, 2026 included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more, the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** Full calculator shown after the answer block (pillars). */
  tool?: ToolKind;
  toolProps?: Record<string, number | string | boolean>;
  /** Mini-simulator after the answer block (guides): `src/lib/minis/<kind>.ts`. */
  mini?: string;
  miniArg?: unknown;
  /** Page id the mini-simulator's button leads to (default: the home comparator). */
  miniHref?: string;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;
