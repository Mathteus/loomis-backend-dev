// import { Controller, Post, Req, Headers, Body } from '@nestjs/common';

// @Controller('webhooks')
// export class WebhooksController {
//   @Post('stripe')
//   async stripeWebhook(@Req() req, @Headers('stripe-signature') sig: string) {
//     // const event = this.gateways.parseStripeEvent(req.rawBody, sig);
//     // if (event.type === 'checkout.session.completed') {
//     // const { signupIntentId, email, customerId } = this.gateways.pickStripeD
//     //   await this.signup.completeFromGateway({ provider: 'STRIPE', signupInten
//     // }
//     // return { ok: true };
//   }

//   @Post('asaas')
//   async asaasWebhook(@Body() body: any) {
//     // const { signupIntentId, email, customerId } = await this.gateways.pickAsa
//     // await this.signup.completeFromGateway({ provider: 'ASAAS', signupIntentId
//     // return { ok: true };
//   }

//   @Post('')
//   async selfWebhook() {

//   }
// }
