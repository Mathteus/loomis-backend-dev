import { Body, Controller, Post, Req, Patch, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('checkout')
  async startCheckout(@Req() req, @Body() body: { priceId: string }) {
    const signupIntentId = crypto.randomUUID();
    // await this.paymentIntents.createPendingIntent({ signupIntentId, priceId,
    //   const checkoutUrl = await this.gateways.startCheckout({
    //   signupIntentId, // vai em metadata/externalReference
    //   priceId: body.priceId,
    // });
    // return { url: checkoutUrl };
  }

  // @Post('stripe')
  // async stripeWebhook(@Req() req, @Headers('stripe-signature') sig: string) {
  //   const event = this.gateways.parseStripeEvent(req.rawBody, sig);
  //   if (event.type === 'checkout.session.completed') {
  //   const { signupIntentId, email, customerId } = this.gateways.pickStripeD
  //   await this.signup.completeFromGateway({ provider: 'STRIPE', signupInten
  //   }
  //   return { ok: true };
  // }

  // @Post('asaas')
  // async asaasWebhook(@Body() body: any) {
  //   const { signupIntentId, email, customerId } = await this.gateways.pickAsa
  //   await this.signup.completeFromGateway({ provider: 'ASAAS', signupIntentId
  //   return { ok: true };
  // }

  // @Patch('me/email')
  // async startEmailChange(@Req() req, @Body() dto: { newEmail: string }) {
  //   await this.users.startEmailChange({ userId: req.user.id, newEmail: dto.ne
  //   return { message: 'Te enviamos um link para confirmar o novo e-mail.' };
  // }
  // @Get('verify-email')
  // async verifyEmail(@Query('token') token: string) {
  //   const { userId, newEmail } = await this.users.finishEmailChange(token);
  //   // Propaga pro gateway também
  //   await this.gateways.updateCustomerEmail({ userId, newEmail }),
  //   return { message: 'E-mail atualizado com sucesso.' };
  // }
}
