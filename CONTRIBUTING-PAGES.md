# Écrire ou étoffer une page de « Student Loan Ledger » (us-student-loans)

Notice pour les agents qui écrivent ou étoffent une page. À lire en entier, avec `~/Documents/GitHub/RECETTE-SITE.md`
(§0, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26) et **`research/FACTS.md`** (les seuls faits publiables comme certains).

Le site : comparateur des plans de remboursement des prêts étudiants fédéraux après la loi du 4 juillet 2025
(Public Law 119-21) et le règlement du 1er mai 2026 (RAP, IBR, Tiered Standard, 10 ans), PSLF, taux 2026-27,
plafonds d'emprunt, déduction des intérêts, SAI et Pell 2026-27. **Anglais américain seul**, sous `/en/`.
Dollars, `$` devant, virgule des milliers. Éditeur : **Radif Partners** (jamais un nom de personne ni une photo).
Aucun lien vers un site du portefeuille (`_trame/domaines-ovh.txt`), ni vers truetakehomepay.com ou mydebtpayoff.com.

## Une page = un fichier

`src/content/pages/<id>.ts` (`definePage`). Le plan (id, slug, groupe, type, requête mesurée) est dans
`src/lib/planned.ts` : la page doit y figurer avec le même `id`, `slug`, `group` et `kind` (le test le vérifie).
Routes, menus, pied de page, sitemap, llms.txt, schémas et maillage lisent ces fichiers seuls.

Modèles (structure seulement, jamais les phrases) :
- pilier avec calculateur complet : `src/content/pages/rap-calculator.ts` ;
- guide avec mini-simulateur : `src/content/pages/rap-vs-ibr.ts`.

| Champ | Règle |
|---|---|
| `id`, `group`, `kind`, `slug` | = `src/lib/planned.ts`. `id` = nom du fichier. |
| `order` | place dans le groupe (10, 20…). |
| `nav`, `card` | libellé de menu (court) ; une phrase pour les cartes. |
| `title` | **50 à 60 caractères**, contient 2026 (ou 2026-27), terme-clé en tête. Jamais en tête : Calculator, How, What, Can, Is, US/American. Pas de tiret cadratin. Unique. |
| `description` | **150 à 160 caractères**, année + au moins un chiffre lu dans les paramètres. Unique. |
| `h1`, `intro` | H1 sans année ; une phrase d'intro. |
| `resume` | **UN** paragraphe de **120 mots ou plus** (130 à 180) : la réponse directe, chiffres compris, première phrase = le message. |
| `tool` / `toolProps` | piliers : `compare`, `payment`, `rap`, `ibr`, `payoff`, `interest`, `refi`, `forgive`, `pslf`, `limits`, `parentplus`, `s529`, `savings`, `sai`, `pell`, `deduction` (`src/components/Tool.astro`). |
| `mini` / `miniArg` | guides : un mini-simulateur `src/lib/minis/<kind>.ts`. |
| `faqs` | piliers 6 à 8, guides 4 à 6. Vraies questions telles qu'on les tape ; réponses de **45 à 85 mots** (test : 42 à 88) avec chiffre, condition, source. **Une question n'existe qu'une fois sur le site.** |
| `body(h)` | HTML. Piliers : **400 mots ou plus** hors tableaux. Guides : **1 000 mots ou plus** hors tableaux (check-seo exige 1 200 mots sur la page). 3 à 6 `<h2>` propres. Au moins un `h.src(...)`. |
| `related` | 3 à 6 ids existants (ou planifiés), plus `home`, `method`, `about`. |
| `sources` | clés de `src/data/params-2026.json > sources` (piliers 3+, guides 2+). |

## La règle des chiffres (non négociable)

Aucun taux, plafond, montant ou date des paramètres n'est tapé en dur : on l'écrit avec le kit
(`src/lib/kit.ts`, aussi passé au corps sous `h.`) : `P` (paramètres), `R` (taux 2026-27), `usd`, `usdx`, `pct`,
`day`, `ym`, `rapPayment`, `ibrPayment`, `ibrLine`, `standard10`, `tieredStandard`, `simulateRap`, `simulateIbr`,
`simulateFixed`, `comparePlans`, `payoff`, `pslfProjection`, `interestDeduction`, `annualLimit`, `futureValue`,
`sai`, `poverty`, `monthInterest`, `pellMin`. Une **hypothèse d'exemple** (« a borrower earning $52,000 ») peut
s'écrire `usd(52000)`. Dans le corps : `h.a(id, texte)` (lien interne, id inconnu = test en échec),
`h.table(entêtes, lignes, légende, alignements)`, `h.src(clé, texte)`, `h.box(titre, html)`, `h.mini(kind, arg)`.

## Mini-simulateurs (`src/lib/minis/<kind>.ts`)

Un fichier par mini, chargé seul. Modèle : `rapQuick.ts`. N'importe **jamais** `src/lib/kit.ts` ni les routes :
seulement `./_kit` (`P`, `usd`, `num`, `pct`, `ym`, `deps`, `sizes`, `yesNo`, `parseArg`) et `../engine/loans` ou
`../engine/sai`. Un à trois champs (`options` pour une liste), le chiffre du sujet en `head`, deux à quatre lignes.
Pas d'année dans un champ numérique. `ctaHref` : chemin d'une page existante (`/en/`, `/en/<slug>/`).

## Ton

Anglais américain, voix humaine, le chiffre d'abord, phrases de longueur variable. Interdits (le test les refuse) :
« — », « it's important to note », « dive into », « delve », « whether you're », « navigate the », « Moreover »,
« Additionally », « Furthermore », « in today's world ». Pas de triplets en série, pas de conclusion-résumé, pas
d'émoji. **Unicité** : `check-unique` compare toutes les pages (seuil 30 %, chiffres neutralisés, 12 000 premiers
caractères) : écrire ce qui n'appartient qu'à la page, avec un vocabulaire propre. **Vérité** : seulement
`research/FACTS.md` ; une règle annoncée mais non publiée ne s'écrit pas comme certaine.

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-student-loans
ALLOW_PLANNED=1 PAGE_FILES=rap-calculator,rap-vs-ibr npx vitest run tests/pages.test.ts   # vos pages
npx vitest run                                    # tout (moteurs + pages, plan complet exigé)
npm run build                                     # inclut typo-nbsp et check-snippets (bloquant)
S=~/Documents/GitHub/_trame/_template/scripts
python3 $S/check-seo.py . ; python3 $S/check-trame.py . ; python3 $S/check-unique.py dist
python3 $S/check-simulateurs.py . ; python3 $S/check-regles.py . ; python3 $S/check-portefeuille.py .
node $S/check-sources.mjs . ; node scripts/check-legal.mjs ; node scripts/typo-nbsp.mjs dist --check
export NODE_PATH=$(npm root -g):$PWD/node_modules
node $S/check-contraste.mjs dist ; node $S/check-saisie.mjs dist --max=60 ; node $S/check-nombres.mjs dist
node $S/check-url-propre.mjs dist ; node $S/check-layout.mjs dist > /tmp/layout-usl.log 2>&1 &
```

Serveur local : port **4405** (`npx astro preview --port 4405`). Arrêt par le port : `lsof -ti tcp:4405 | xargs kill`.

## Mise à jour annuelle

- **Chaque juin-septembre** : avis des taux du Federal Register (prêts versés à partir du 1er juillet) → `P.rates`.
- **Janvier** : lignes de pauvreté HHS → `P.fpl` (RAP n'en dépend pas ; IBR oui).
- **Automne** : guide SAI de la nouvelle année et avis « Federal Need Analysis Methodology » → `P.sai`, `P.fpl['2025']`
  pour 2027-28 ; loi de finances → `P.pell` ; Rev. Proc. IRS → `P.deduction`, `P.employer127`.
- Puis `npx vitest run` : les tests rejouent les exemples officiels.

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS, pas de Chrome. Ne pas toucher à `_trame` ni à la RECETTE.
