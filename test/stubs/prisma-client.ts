export const roles_account = {
  admin: 'admin',
  member: 'member',
} as const;

export type CompanyCustomers =
  | 'C1_10'
  | 'C11_20'
  | 'C21_50'
  | 'C51_100'
  | 'C100P';
export type CompanyEmployees =
  | 'JUST_ME'
  | 'C1_10'
  | 'C11_20'
  | 'C21_50'
  | 'C51_100'
  | 'C100P';
export type CompanyType =
  | 'DIGITAL_MARKETING_AGENCY'
  | 'SERVICE_COMPANY'
  | 'BUSINESS'
  | 'STARTUP';

export class PrismaClient {}
