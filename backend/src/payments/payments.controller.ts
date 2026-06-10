import { Controller, Post, Body, Req, Res, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('iyzico')
  async startPayment(
    @Body() body: any,
    @Req() req: any,
  ) {
    const { shippingInfo, items, total, userId } = body;

    const orderId = `KUIS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const host = req.get('host') || 'localhost:3001';
    const protocol = req.protocol || 'http';
    const callbackUrl = `${protocol}://${host}/api/payments/iyzico/callback`;

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

    try {
      await this.ordersService.create({
        id: orderId,
        userId: userId || null,
        total: total,
        shippingInfo: shippingInfo,
        items: items,
      });
    } catch (err) {
      console.error('Prisma draft order create failed:', err);
      throw new InternalServerErrorException('Sipariş taslağı oluşturulamadı.');
    }

    const contactName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;
    const totalValStr = String(total);

    const basketItems = items.map((item: any, index: number) => ({
      id: item.id || `ITEM-${index}`,
      name: item.name,
      category: 'Scarf',
      itemType: 'PHYSICAL',
      price: String(item.price * item.quantity),
    }));

    const requestPayload = {
      locale: 'tr',
      conversationId: orderId,
      price: totalValStr,
      paidPrice: totalValStr,
      currency: 'TRY',
      basketId: orderId,
      paymentGroup: 'PRODUCT',
      callbackUrl: callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: userId || `BUYER-${Date.now()}`,
        name: shippingInfo.firstName,
        surname: shippingInfo.lastName,
        gsmNumber: shippingInfo.phone,
        email: shippingInfo.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: shippingInfo.address,
        ip: clientIp,
        city: shippingInfo.city,
        country: 'Turkey',
        zipCode: shippingInfo.postcode || '34000',
      },
      shippingAddress: {
        contactName: contactName,
        city: shippingInfo.city,
        country: 'Turkey',
        address: shippingInfo.address,
        zipCode: shippingInfo.postcode || '34000',
      },
      billingAddress: {
        contactName: contactName,
        city: shippingInfo.city,
        country: 'Turkey',
        address: shippingInfo.address,
        zipCode: shippingInfo.postcode || '34000',
      },
      basketItems: basketItems,
    };

    try {
      const result = await this.paymentsService.createIyzipayCheckout(requestPayload);
      if (result.status === 'success' && result.paymentPageUrl) {
        return { paymentPageUrl: result.paymentPageUrl };
      } else {
        console.error('iyzico Checkout initialization failed:', result);
        throw new BadRequestException(result.errorMessage || 'iyzico ödeme oturumu başlatılamadı.');
      }
    } catch (err: any) {
      console.error('iyzico start payment exception:', err);
      throw new InternalServerErrorException(err.message || 'Ödeme oturumu başlatılamadı.');
    }
  }

  @Post('iyzico/callback')
  async paymentCallback(
    @Body() body: any,
    @Res() res: any,
  ) {
    let orderId = '';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    try {
      const token = body.token || '';
      if (!token) {
        console.error('[iyzico Callback] Missing token in request body.');
        return res.redirect(`${frontendUrl}/order/failed?id=unknown`);
      }

      const result = await this.paymentsService.retrieveIyzipayResult({
        locale: 'tr',
        token: token,
      });

      orderId = result.conversationId || '';
      if (!orderId) {
        console.error('[iyzico Callback] Missing conversationId in retrieve response.');
        return res.redirect(`${frontendUrl}/order/failed?id=unknown`);
      }

      const isSuccess = result.paymentStatus === 'SUCCESS';

      try {
        const order = await this.ordersService.findOne(orderId);
        const shippingInfo: any = order.shippingInfo;
        
        const updatedShippingInfo = {
          ...shippingInfo,
          paymentDetails: {
            paymentId: result.paymentId,
            installment: result.installment || 1,
            cardType: result.cardType || null,
            cardAssociation: result.cardAssociation || null,
            cardFamily: result.cardFamily || null,
            updatedAt: new Date().toISOString(),
          },
        };

        await this.ordersService.update(orderId, {
          status: isSuccess ? OrderStatus.PAID : OrderStatus.FAILED,
          shippingInfo: updatedShippingInfo,
        });

        console.log(`[iyzico Webhook] Order ${orderId} successfully updated to status: ${isSuccess ? 'PAID' : 'FAILED'}`);
      } catch (dbError) {
        console.error('[iyzico Webhook] Failed to update order in database:', dbError);
      }

      if (isSuccess) {
        return res.redirect(`${frontendUrl}/order/success?id=${orderId}`);
      } else {
        return res.redirect(`${frontendUrl}/order/failed?id=${orderId}`);
      }
    } catch (err) {
      console.error('iyzico callback exception:', err);
      return res.redirect(`${frontendUrl}/order/failed?id=${orderId || 'unknown'}`);
    }
  }
}
