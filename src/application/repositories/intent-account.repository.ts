export interface ICreateProps {
  email: string;
  paymentPlan: string;
  paymentId: string;
}

export abstract class IntentAccountRepository {
  abstract create(props: ICreateProps): Promise<void>;
  abstract payPlan(props: ICreateProps): Promise<void>;
}
