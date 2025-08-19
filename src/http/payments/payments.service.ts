import { HashGenerator } from '@/common/hash/hash-generator.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  constructor(private readonly hasher: HashGenerator) {}

  public async startCheck() {
    const signuoIntentId = this.hasher.UUID();
  }
}
