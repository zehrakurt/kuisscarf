import { Controller, Post, Body, Req, Res, InternalServerErrorException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('paytr')
  async startPaytrPayment(
    @Body() body: any,
    @Req() req: any,
  ) {
    const { shippingInfo, items, total, userId } = body;

    const orderId = `KUIS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const host = req.get('host') || 'localhost:3001';
    const protocol = req.protocol || 'http';
    
    // For local development or production callback URLs
    const callbackUrl = process.env.PAYTR_CALLBACK_URL || `${protocol}://${host}/api/payments/paytr/callback`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

    // Create Draft Order
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

    const userName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;
    const paymentAmount = Math.round(total * 100).toString(); // in kuruş

    // User Basket
    const basketItems = items.map((item: any) => [
      item.name,
      String(item.price),
      String(item.quantity)
    ]);
    const userBasket = Buffer.from(JSON.stringify(basketItems)).toString('base64');

    const payload = {
      userIp: clientIp,
      merchantOid: orderId,
      email: shippingInfo.email,
      paymentAmount: paymentAmount,
      userBasket: userBasket,
      noInstallment: '0',
      maxInstallment: '12',
      currency: 'TL',
      userName: userName,
      userAddress: shippingInfo.address + ' ' + shippingInfo.city,
      userPhone: shippingInfo.phone,
      merchantOkUrl: `${frontendUrl}/order/success?id=${orderId}`,
      merchantFailUrl: `${frontendUrl}/order/failed?id=${orderId}`,
    };

    try {
      const paytrToken = this.paymentsService.generatePaytrToken(payload);
      
      const params = new URLSearchParams();
      params.append('merchant_id', process.env.PAYTR_MERCHANT_ID || '');
      params.append('user_ip', payload.userIp);
      params.append('merchant_oid', payload.merchantOid);
      params.append('email', payload.email);
      params.append('payment_amount', payload.paymentAmount);
      params.append('paytr_token', paytrToken);
      params.append('user_basket', payload.userBasket);
      params.append('debug_on', '1');
      params.append('no_installment', payload.noInstallment);
      params.append('max_installment', payload.maxInstallment);
      params.append('user_name', payload.userName);
      params.append('user_address', payload.userAddress);
      params.append('user_phone', payload.userPhone);
      params.append('merchant_ok_url', payload.merchantOkUrl);
      params.append('merchant_fail_url', payload.merchantFailUrl);
      params.append('timeout_limit', '30');
      params.append('currency', payload.currency);
      params.append('test_mode', process.env.PAYTR_TEST_MODE || '1');

      const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const result: any = await response.json();

      if (result.status === 'success') {
        return { paymentPageUrl: `https://www.paytr.com/odeme/guvenli/${result.token}` };
      } else {
        console.error('PayTR Token initialization failed:', result);
        throw new BadRequestException(result.reason || 'PayTR ödeme oturumu başlatılamadı.');
      }
    } catch (err: any) {
      console.error('PayTR start payment exception:', err);
      throw new InternalServerErrorException(err.message || 'Ödeme oturumu başlatılamadı.');
    }
  }

  @Post('paytr/callback')
  @HttpCode(HttpStatus.OK)
  async paytrCallback(
    @Body() body: any,
    @Res() res: any,
  ) {
    try {
      const { merchant_oid, status, total_amount, hash } = body;

      // Verify PayTR Callback Token
      const isValid = this.paymentsService.verifyPaytrCallback({
        merchantOid: merchant_oid,
        status: status,
        totalAmount: total_amount,
        hash: hash,
      });

      if (!isValid) {
        console.error('[PayTR Webhook] Invalid signature hash');
        return res.status(HttpStatus.BAD_REQUEST).send('FAIL');
      }

      const isSuccess = status === 'success';

      try {
        const order = await this.ordersService.findOne(merchant_oid);
        const shippingInfo: any = order.shippingInfo;

        const updatedShippingInfo = {
          ...shippingInfo,
          paymentDetails: {
            provider: 'PayTR',
            paymentStatus: status,
            totalPaid: total_amount,
            updatedAt: new Date().toISOString(),
          },
        };

        await this.ordersService.update(merchant_oid, {
          status: isSuccess ? OrderStatus.PAID : OrderStatus.FAILED,
          shippingInfo: updatedShippingInfo,
        });

        console.log(`[PayTR Webhook] Order ${merchant_oid} successfully updated to status: ${isSuccess ? 'PAID' : 'FAILED'}`);
      } catch (dbError) {
        console.error('[PayTR Webhook] Failed to update order in database:', dbError);
      }

      // PayTR expects exactly 'OK' response to confirm receipt
      return res.send('OK');
    } catch (err) {
      console.error('PayTR callback exception:', err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('FAIL');
    }
  }
}
