import { isEmailValido } from '@/utility';
import { PaymentPlan, PaymentStatus } from '@prisma/client';

export enum PaymentStatusIntent {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentPlanIntent {
  STANDARD = 'STANDARD',
  PLUS = 'PLUS',
  PREMIUM = 'PREMIUM',
}

export interface IIntentProps {
  email: string;
  paymentStatus: PaymentStatusIntent;
  paymentPlan: PaymentPlanIntent;
}

export class ErrorEmailInvalid extends Error {
  constructor() {
    super('Email está em formato inválido!');
  }
}

export class IntentAccountEntity {
  private _self: IIntentProps;

  constructor(account: IIntentProps) {
    this.verifyEmail(account.email);
    this._self = account;
  }

  private verifyEmail(email: string) {
    if (!isEmailValido(email)) {
      throw new ErrorEmailInvalid();
    }
  }

  public get email() {
    return this._self.email;
  }

  public get paymentStatus() {
    return this._self.paymentStatus;
  }

  public get paymentPlan() {
    return this._self.paymentPlan;
  }

  public toPay() {
    this._self.paymentStatus = PaymentStatusIntent.PAID;
  }

  public paymentStatusToPrisma(): PaymentStatus {
    return this._self.paymentStatus;
  }

  public paymentPlanToPrima(): PaymentPlan {
    return this._self.paymentPlan;
  }
}
