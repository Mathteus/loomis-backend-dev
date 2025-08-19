export abstract class RefreshTokensRepository {
  abstract regiterToken(hash: string, refreshToken: string): Promise<void>;
  abstract getTokenByHash(hash: string): Promise<string>;
  abstract removeTokenByHash(hash: string): Promise<void>;
}
