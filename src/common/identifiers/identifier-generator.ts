import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IdentifiersGeneratorService {
  abstract generate(sub: string): string;
}
