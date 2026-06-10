import { Injectable } from '@nestjs/common';
import Iyzipay from 'iyzipay';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private iyzipay: any;

  constructor(private ordersService: OrdersService) {
    const apiKey = process.env.IYZICO_API_KEY || '';
    const secretKey = process.env.IYZICO_SECRET_KEY || '';
    const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

    this.iyzipay = new Iyzipay({
      apiKey: apiKey || 'dummy-api-key',
      secretKey: secretKey || 'dummy-secret-key',
      uri: baseUrl,
    });
  }

  async createIyzipayCheckout(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.create(request, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async retrieveIyzipayResult(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
