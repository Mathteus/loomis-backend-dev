import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  /**
   * Cria um PaymentIntent (fluxo mais comum)
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount, // em centavos! ex: R$10,00 => 1000
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }

  /**
   * Recupera um PaymentIntent
   */
  async retrievePaymentIntent(id: string) {
    return this.stripe.paymentIntents.retrieve(id);
  }

  /**
   * Cria um cliente
   */
  async createCustomer(email: string, name?: string) {
    return this.stripe.customers.create({ email, name });
  }

  async createPendingIntent() {
    this.stripe.
  }
}
