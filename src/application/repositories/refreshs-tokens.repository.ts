export abstract class RefreshTokensRepository {
  abstract regiterToken(accountId: string): Promise<string>;
  abstract getTokenByHash(hash: string): Promise<string>;
  abstract removeTokenByHash(hash: string): Promise<void>;
}
