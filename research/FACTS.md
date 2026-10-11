# Verified facts (read on official documents, 2026-10-11)

Every figure below is already in `src/data/params-2026.json` (read it through the kit, never type it).
Only these facts may be stated as certain. Anything not here: leave it out, or read the official copy in
`research/` yourself and cite it. Copies in this folder: `obbba-title-viii-education.txt` (law, Title VIII),
`pl-119-21-obbba.txt` (whole law), `fr-2026-08556-rise-final.clean.txt` (RISE final rule, regulatory text at
the end: 685.203 line ~12948, 685.208 ~13262, 685.209 ~13502, 685.211 ~14462, 685.219 ~14668, 685.220 ~15110),
`fr-2025-19729-pslf-final.txt`, `fr-2026-18493-fixed-rates.txt`, `fr-2025-10243-need-analysis-2026-27.txt`,
`sai-guide-2026-27.txt`, `ed-*.txt` (Department of Education press releases), `irs-rev-proc-2025-32.txt`,
`hhs-poverty-guidelines-2026.txt`, `fr-2024-00796-poverty-2024.txt`, `pl-119-75-fy2026-approps.htm`,
`usc-20-1070a.txt`, `ecfr-34cfr685-203.txt`, `ecfr-34cfr685-219.txt`.

## The law and its name
- Public Law 119-21, signed July 4, 2025 ("One Big Beautiful Bill Act"). The Department of Education now calls it the **Working Families Tax Cuts Act** (RISE final rule; press releases since 2026). Mention both names once per page at most.
- RISE final regulations: published May 1, 2026 (91 FR 23768), effective July 1, 2026; rehabilitation, deferment, forbearance provisions effective July 1, 2027; sunsetting of certain plans July 1, 2028. Negotiated rulemaking committee "RISE" met Sept-Nov 2025, reached consensus; NPRM Jan 30, 2026; 80,000+ comments.

## Repayment plans
- **RAP** (HEA 455(q); 34 CFR 685.209): opened July 1, 2026. Base payment = $120/yr if AGI ≤ $10,000; then 1% of the WHOLE AGI for $10,001–20,000, 2% for 20,001–30,000 … 9% for 90,001–100,000, 10% above $100,000. Monthly = base/12 − $50 per dependent (dependent = IRC sec. 152 dependent claimed on the return; MFS: only those on the borrower's return). Minimum $10 (final payment may be less). MFJ: combined AGI; if spouse has eligible loans, payment × borrower's share of the couple's balances, still $10 minimum. MFS: borrower's AGI only.
- RAP: payment applied to interest, then fees, then principal; on-time payment → unpaid interest of the month not charged (685.209(h)(4)). Matching principal: if on-time payment cuts principal by < $50, ED reduces principal by min($50, payment) − principal paid (685.209(o)(2)); not during deferment/forbearance. Paying ahead advances the due date and removes the match for months without a due date; borrower can opt out of advancing (685.209(o)(3)).
- RAP forgiveness after 360 qualifying payments (30 years), last payment before cancellation under RAP. Qualifying payments include: on-time RAP payment; on-time Tiered Standard payment; any plan payment ≥ 10-year standard amount; IBR payments (incl. minimum); before July 1, 2028 ICR-plan payments; months of unemployment or economic hardship deferment; certain deferment/forbearance months before July 1, 2026.
- RAP eligible loans: Direct Subsidized, Unsubsidized, Grad PLUS, Direct Consolidation not repaying parent PLUS; defaulted loans included. Not: parent PLUS and consolidations that repaid them ("excepted loans").
- RAP recertification: annual, with IRS data (consent). Missing info → payment = 10-year standard on balance when loans entered repayment (685.209(l)(9)(iv)). Can request recalculation anytime (loss of income, divorce).
- ED fact sheet June 9, 2026 examples: $45,000 income, no dependents, $35,000 debt: prior IDR $176/mo, RAP $150/mo, ~$40 interest waived monthly, $50 match. $35,000 income, $20,000 balance, no dependents: about $400 interest waived over life and could receive $2,000 in matching payments. $30,000 balance: 10-year standard $341, Tiered Standard $262 (15 years). "3 out of 4 borrowers in IDR owe more than originally borrowed 6 years after entering repayment" (ED claim; attribute it).
- **Tiered Standard** (HEA 455(d)(7)(A)(i); 685.208(c)(1), (b)(8)): fixed payment; total principal < $25,000 → 10 years; $25,000–49,999 → 15; $50,000–99,999 → 20; ≥ $100,000 → 25. Minimum $50 (or balance if less). Default plan for new-loan borrowers who choose nothing.
- **Who gets which plans**: borrower with any Direct Loan made on/after July 1, 2026: only Tiered Standard or RAP, for all Direct Loans (455(d)(7)(A),(C)); can switch between them at any time. Only loans made before July 1, 2026 may be repaid under PAYE, IBR, ICR (685.209(d)(5)). New Direct Consolidation Loans made on/after July 1, 2026: only Tiered Standard or RAP (455(g)(3)).
- **IBR** (HEA 493C; 685.209): partial financial hardship test removed (effective July 4, 2025). 15% of AGI above 150% of poverty guideline (10% for "new borrower": no balance before July 1, 2014, and no loan on/after July 1, 2026). Capped at 10-year standard amount computed when entering IBR (may then exceed 10 years). Under $5 → $0; $5–$10 → $10. Forgiveness: 20 years (240) new borrower, 25 years (300) others. Unpaid interest accrues (3-year subsidy on subsidized loans exists, not modeled). Borrower with 60+ qualifying REPAYE/SAVE payments since July 1, 2024 may not enroll in IBR (685.209(c)(3)(ii)).
- **Old plans**: PAYE and ICR end June 30, 2028 (borrowers already on them; closed to others). Before July 1, 2028, PAYE/ICR borrowers must elect RAP, IBR, standard, graduated or extended; new plan starts July 1, 2028 (or earlier if chosen). No election → RAP (or IBR for loans not RAP-eligible) on July 1, 2028.
- **Parent PLUS**: new parent PLUS made on/after July 1, 2026 → Tiered Standard only (455(d)(7)(E)). Consolidation that repaid parent PLUS = excepted consolidation, not eligible for IBR or RAP, EXCEPT if it was being repaid under ICR, PAYE or IBR on any date from July 4, 2025 through June 30, 2028 (at least one payment) (685.209(b)(6)(ii)). Through June 30, 2028, a borrower may choose ICR for a Direct Consolidation Loan that repaid parent PLUS (if no new loan after July 1, 2026). A consolidation disbursed on/after July 1, 2025 repaying parent PLUS can choose only ICR among IDR plans through June 30, 2028.
- **SAVE**: Dec 9, 2025 ED/Missouri proposed settlement; court approved it in March 2026 ("Earlier this month, a court ended the illegal SAVE Plan by approving a settlement", release of March 27, 2026). No new enrollments, pending applications denied. ~7.5 million borrowers. From July 1, 2026 servicers send notices with a 90-day deadline; no choice → Standard or new Tiered Standard plan. SAVE forbearance had 0% interest until Aug 1, 2025 (interest resumed per July 2025 email). Formula of REPAYE/SAVE (685.209(f)(1)): 5% (undergrad loans) / 10% (grad) of income above 225% of poverty. Forbearance/deferment provisions of the SAVE rule that count for IDR forgiveness are kept.
- **Auto pay**: usual 0.25 point reduction; from July 1, 2026, borrowers on auto pay get 1 point total reduction through June 30, 2028 if enrolled by Dec 31, 2026 (extended from Sept 30, 2026 on Sept 29, 2026); Direct Loans originated after July 1, 2012; nearly 2 million enrolled since June. Defaulted borrowers must consolidate and pick a plan first. Must stay on auto pay. Before COVID >80% of active borrowers on auto pay, now 40% (ED claim).
- **Deferment/forbearance**: loans made on/after July 1, 2027: no unemployment or economic hardship deferment; forbearance max 9 months in any 24-month period.
- **Default**: second loan rehabilitation allowed from July 1, 2027 (was once). From July 1, 2027, rehabilitation "reasonable and affordable" payment = eligible IDR payment, minimum $10 (685.211). Involuntary collections (wage garnishment, Treasury offset) delayed (ED Jan 16, 2026), no end date announced in what we read; defaults reported to credit bureaus.

## Rates (Federal Register 2026-18493, Sept 10, 2026)
- May 12, 2026 10-year Treasury auction high yield 4.468%, rounded 4.47%.
- Loans first disbursed July 1, 2026 – June 30, 2027: undergrad 6.52% (add-on 2.05, cap 8.25); grad/professional unsub 8.07% (3.60, cap 9.50); PLUS 9.07% (4.60, cap 10.50). Fixed for life.
- History: 2025-26 6.39/7.94/8.94; 2024-25 6.53/8.08/9.08; 2023-24 5.50/7.05/8.05.
- Loan origination fees: NOT verified for 2026-27 → do not state fee percentages.

## Loan limits (from July 1, 2026; 34 CFR 685.203; HEA 455(a))
- Undergrad unchanged: dependent $5,500 / $6,500 / $7,500 (sub max $3,500/$4,500/$5,500), aggregate $31,000 (sub $23,000); independent $9,500 / $10,500 / $12,500, aggregate $57,500 (sub $23,000).
- Graduate (non-professional) unsub: $20,500/yr, aggregate $100,000 (in addition to undergrad borrowing). Professional: $50,000/yr, aggregate $200,000. Combined grad+prof cap $200,000.
- Before July 1, 2026 grad unsub $20,500/yr ($8,500 + $12,000), aggregate $138,500 incl. undergrad; Grad PLUS up to cost of attendance.
- Grad PLUS: no new loans for periods of instruction beginning on/after July 1, 2026.
- Parent PLUS: $20,000/yr per dependent student (all parents together), $65,000 aggregate per student, regardless of repayment.
- Lifetime cap: $257,500 for all federal loans except parent PLUS borrowed as a parent.
- Less than full time: annual limit reduced in proportion (Secretary's schedule).
- Schools may set lower limits for a program, applied consistently.
- Interim exception: student enrolled in a program on June 30, 2026 who received a Direct Loan for it keeps old limits for the "expected time to credential" = lesser of 3 academic years or program length minus time completed. Lost if the student withdraws. Changing majors within same degree = same program.
- "Professional student" = program awarding a professional degree as defined in 34 CFR 668.2 (law, medicine, dentistry, pharmacy, etc.; RISE final rule added a definition; do not list programs beyond "law, medicine, dentistry" unless you read the list).
- ED July 1 fact sheet: UC Irvine cut MBA tuition 20%+; Univ. of Kansas law scholarships and endowment loans; Santa Clara Law $16,000 "Pledge Scholarship" (ED claims; attribute).

## PSLF (34 CFR 685.219; HEA 455(m))
- 120 qualifying monthly payments while employed full time by a qualifying employer; full time = average 30+ hours/week (or 30+/week for 8 months of 12 for school-year employees). Not in default; employed full time when applying and when forgiven. Direct Loans only.
- Qualifying plans: any IDR plan under 685.209, the 10-year standard, any other plan with payment ≥ 10-year standard amount (so Tiered Standard counts only when its payment ≥ 10-year standard amount), ICR payments until June 30, 2028, and RAP (added by law sec. 82004).
- Employer rule (final rule Oct 31, 2025, 90 FR 48966, effective July 1, 2026): qualifying employer excludes organizations engaged in activities with a "substantial illegal purpose" (e.g. aiding or abetting violations of federal immigration law, supporting terrorism, and other listed illegal activities). ~14,000 comments. Executive Order 14235 (March 7, 2025).
- PSLF forgiveness is tax-free (IRC 108(f)(1)).

## Tax
- IRC 108(f)(5) rewritten by sec. 70119: from 2026 excludes only discharges for death or total and permanent disability (incl. private loans). The broad 2021–2025 exclusion for other discharges is gone → IDR/RAP forgiveness after 2025 may be federal taxable income unless another exclusion (e.g. insolvency) applies. Do not state state-tax treatment.
- Student loan interest deduction 2026 (Rev. Proc. 2025-32 sec. 4.29): max $2,500; phase-out MAGI $85,000–$100,000 single, $175,000–$205,000 joint; not allowed married filing separately; above-the-line (no itemizing). Form 1098-E.
- Employer payments (IRC 127, sec. 70412): up to $5,250/yr tax-free educational assistance incl. student loan payments, now permanent for payments after Dec 31, 2025; indexed to inflation for taxable years beginning after 2026.
- 529 (sec. 70413-70414): K-12 tuition limit $10,000 → $20,000 for taxable years beginning after Dec 31, 2025; K-12 expenses widened (curriculum, books, online materials, tutoring, test fees, dual enrollment, therapies) for distributions after July 4, 2025; recognized postsecondary credential programs (licenses, certifications, apprenticeships) qualify. Gift tax annual exclusion 2026: $19,000.

## FAFSA, SAI, Pell (2026-27)
- 2026-27 FAFSA uses 2024 tax data and 2024 poverty guidelines (48 states $15,060 + $5,380/person; AK $18,810 + $6,730; HI $17,310 + $6,190). 2027-28 FAFSA launched Sept 23, 2026 (earliest ever, ED); certified Aug 25, 2026; FAFSA Deadline Act requires launch by Oct 1.
- Max Pell 2026-27: $7,395 = $6,335 (Public Law 119-75, Feb 3, 2026) + $1,060 (20 U.S.C. 1070a(b)(5)(A)(i)); minimum Pell = 10% of max ($739.50 by the formula; ED schedules round).
- Max Pell eligibility: non-filers (SAI −1,500); single parent AGI ≤ 225% of poverty; others ≤ 175%. Min Pell lines: dependent single parent ≤ 325%, dependent other ≤ 275%; independent single parent ≤ 400%, independent parent not single ≤ 350%, independent not a parent ≤ 275%. Award ≈ max − SAI if SAI ≤ max − min.
- New (law sec. 83001(b), from July 1, 2026): SAI ≥ twice the max Pell ($14,790) → no Pell. Foreign income added to AGI for Pell from 2026-27. Sec. 83004: no Pell when non-federal grants ≥ cost of attendance. Workforce Pell: programs of 150–599 clock hours over 8–14 weeks, approved by the Governor then ED; 70% completion and 70% job placement; tuition ≤ value-added earnings; launched July 1, 2026; first approved program in Iowa, then Indiana, Florida, Nebraska, North Carolina, Texas (ED releases). Not for students with or seeking a graduate credential.
- SAI tables 2026-27: IPA parents 2:$29,190, 3:$36,330, 4:$44,880, 5:$52,950, 6:$61,930, +$6,990; dependent student $11,770; independent no dependents $18,310 single / $29,350 married; married with dependents 3:$57,730 … +$11,110; single with dependents 2:$54,950 … +$13,180. Asset protection allowance $0 at all ages. Assessment: 22% up to $21,800 then 25/29/34/40/47%. EEA lesser of $5,000 or 35% of earned income. Parent asset rate 12%, dependent student assets 20%, student income 50% above $11,770 allowance, independent no-dependents assets 20%, with dependents 7%. SAI floor −1,500.
- Business/farm net worth table still in the guide, but sec. 80001 (from award year 2026-27): a family farm the family lives on, a small business with ≤ 100 employees owned and controlled by the family, and a commercial fishing business are excluded from net worth.
- EFC was replaced by the SAI starting with 2024-25 (FAFSA Simplification Act). Number in college no longer reduces the SAI (true in the current formula: no such line).

## Never write
- Loan fee percentages, private lender rates, state programs, servicer names as facts, a date for collections to restart, anything about "student loan forgiveness" programs other than PSLF/IDR/RAP/death-disability (no "Biden forgiveness" news).
- Never link to truetakehomepay.com, mydebtpayoff.com or any portfolio domain.
