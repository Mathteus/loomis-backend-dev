export abstract class PasswordHasherService {
  abstract toHash(password: string): Promise<string>;
  abstract compare(
    passwordRaw: string,
    passwordHashed: string,
  ): Promise<boolean>;
}
