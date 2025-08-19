export interface IJWTEntity {
  body?: unknown;
  sub: string;
  type: 'ACCESS' | 'REFRESH' | 'RECOVERY_TICKET' | 'RESET_TICKET';
}

export class JwtEntity {
  private _jwtBody: IJWTEntity;

  constructor(jwtBody: IJWTEntity) {
    this._jwtBody = jwtBody;
  }

  public get body() {
    return this._jwtBody.body ?? null;
  }

  public get sub(): string {
    return this._jwtBody.sub;
  }

  public get type(): string {
    return this._jwtBody.type;
  }

  public toPlainObject(): { body?: unknown; sub: string; type: string } {
    const obj = {
      body: this._jwtBody.body ?? null,
      sub: this._jwtBody.sub,
      type: this._jwtBody.type,
    };
    return obj;
  }
}
