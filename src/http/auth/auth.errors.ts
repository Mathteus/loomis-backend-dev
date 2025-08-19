export class AuthUserAlreadyRegistered extends Error {
  constructor() {
    super('Usuário já registrado no sistema');
  }
}

export class AuthUserNotExists extends Error {
  constructor() {
    super('Usuário não existe no sistema');
  }
}

export class AuthRecoveryCodeWrong extends Error {
  constructor() {
    super('Código de varificação de conta está inválido!');
  }
}

export class AuthIntentAccountNotFound extends Error {
  constructor() {
    super('Conta relacionada ao pagamanto não esta registrada!');
  }
}
