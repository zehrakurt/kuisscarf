import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private merchantId: string;
  private merchantKey: string;
  private merchantSalt: string;
  private testMode: string;

  constructor() {
    this.merchantId = process.env.PAYTR_MERCHANT_ID || '';
    this.merchantKey = process.env.PAYTR_MERCHANT_KEY || '';
    this.merchantSalt = process.env.PAYTR_MERCHANT_SALT || '';
    this.testMode = process.env.PAYTR_TEST_MODE || '1';
  }

  generatePaytrToken(payload: {
    userIp: string;
    merchantOid: string;
    email: string;
    paymentAmount: string;
    userBasket: string;
    noInstallment: string;
    maxInstallment: string;
    currency: string;
  }): string {
    const hashStr =
      this.merchantId +
      payload.userIp +
      payload.merchantOid +
      payload.email +
      payload.paymentAmount +
      payload.userBasket +
      payload.noInstallment +
      payload.maxInstallment +
      payload.currency +
      this.testMode;

    return crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr + this.merchantSalt)
      .digest('base64');
  }

  verifyPaytrCallback(payload: {
    merchantOid: string;
    status: string;
    totalAmount: string;
    hash: string;
  }): boolean {
    const hashStr = payload.merchantOid + this.merchantSalt + payload.status + payload.totalAmount;
    const generatedHash = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr)
      .digest('base64');

    return generatedHash === payload.hash;
  }
}
