/** Menu groups of the site. Every page file names its group; menus, footer and breadcrumbs read them. */
export type Group = 'repay' | 'forgive' | 'borrow' | 'aid' | 'tax';
export interface GroupInfo { id: Group; label: string; short: string }
export const GROUPS: GroupInfo[] = [
  { id: 'repay', label: 'Repayment after the 2025 law', short: 'Repay' },
  { id: 'forgive', label: 'Forgiveness and PSLF', short: 'Forgiveness' },
  { id: 'borrow', label: 'Borrowing, limits and rates', short: 'Borrow' },
  { id: 'aid', label: 'FAFSA, SAI and Pell Grant', short: 'FAFSA & Pell' },
  { id: 'tax', label: 'Taxes and college savings', short: 'Tax & 529' },
];
export const groupInfo = (id: Group): GroupInfo => GROUPS.find((g) => g.id === id)!;
