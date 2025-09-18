import { Injectable } from '@nestjs/common';
import { CodeGeneratorService } from '@/common/code-generator/code-generator';

@Injectable()
export class FakeCodeGeneratorService implements CodeGeneratorService {
  async generateCode(): Promise<string> {
    return '123456';
  }
}

