export interface IEmailSendProps {
  to: string;
  subject: string;
  html: string;
}

export interface IEmailRecoveryPassword {
  to: string;
  username: string;
}

export interface IEmailFirstLogin {
  to: string;
  password: string;
}

export abstract class EmailService {
  abstract sendCodeVerify(props: IEmailRecoveryPassword): Promise<void>;
  abstract sendEmailFirtLogin(prosp: IEmailFirstLogin): Promise<void>;
}
