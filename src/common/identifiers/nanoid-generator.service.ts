import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { IdentifiersGeneratorService } from './identifier-generator';

@Injectable()
export class NanoidGeneratorService implements IdentifiersGeneratorService {
  private readonly size = 10;

  public generate(sub: string): string {
    const now = new Date().getTime();
    return `${sub}-${now}-${nanoid(this.size)}`;
  }
}
