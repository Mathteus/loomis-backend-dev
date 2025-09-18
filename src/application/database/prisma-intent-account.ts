// import { Injectable } from '@nestjs/common';
// import {
//   ICreateProps,
//   IntentAccountRepository,
// } from '../repositories/intent-account.repository';
// import { PrismaService } from './config/prisma.service';
// import { PaymentPlan, PaymentStatus } from '@prisma/client';

// @Injectable()
// export class PrimaAccountIntentService implements IntentAccountRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(props: ICreateProps): Promise<void> {
//     await this.prisma.intentAccount.create({
//       data: {
//         email: props.email,
//         plan: props.paymentPlan as PaymentPlan,
//         paymentid: props.paymentId,
//       },
//     });
//   }

//   async payPlan(account: ICreateProps): Promise<void> {
//     const response = await this.prisma.intentAccount.update({
//       where: {
//         paymentid: account.paymentId,
//       },
//       data: {
//         paymentstatus: PaymentStatus.PAID,
//       },
//     });

//     if (!response) {
//       await this.create(account);
//       await this.payPlan(account);
//     }
//   }
// }
