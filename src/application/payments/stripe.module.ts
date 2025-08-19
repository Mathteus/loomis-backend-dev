import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Stripe(
          configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
          {
            apiVersion: '2025-07-30.basil', // use a versão mais nova da API Stripe
          },
        );
      },
    },
    StripeService,
  ],
  exports: ['STRIPE_CLIENT', StripeService],
})
export class StripeModule {}
