export abstract class CodeGeneratorService {
  abstract generateCode(): Promise<string>;
}
