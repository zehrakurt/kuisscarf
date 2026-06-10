import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: any) {
    const { id, userId, total, shippingInfo, items } = createOrderDto;

    return this.prisma.order.create({
      data: {
        id,
        userId: userId || null,
        total: Number(total),
        shippingInfo: shippingInfo || {},
        items: items || [],
        status: OrderStatus.PENDING,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı.');
    }
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, updateOrderDto: any) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
        shippingInfo: updateOrderDto.shippingInfo,
        items: updateOrderDto.items,
        total: updateOrderDto.total !== undefined ? Number(updateOrderDto.total) : undefined,
      },
    });
  }
}
