import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(dto: CreateOrderDto, userId: number) {
    const {
      addressId,
      deliveryOptionId,
      couponId,
      items,
      subtotal,
      shippingFee,
      gst,
      totalAmount,
      note,
    } = dto;

    if (!items || !Array.isArray(items)) {
      throw new BadRequestException('Order items are required and must be an array.');
    }

    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        address: { connect: { id: addressId } },
        paymentMethod: 'COD',
        coupon: couponId ? { connect: { id: couponId } } : undefined,
        subtotal,
        shippingFee,
        gst,
        totalAmount,
        note,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
        payment: {
          create: {
            method: 'COD',
            status: 'PENDING',
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    return order;
  }

  async getOrderDetails(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payment: true,
        address: true,
        deliveryOption: true,
        coupon: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async listOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        deliveryOption: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateInvoice(orderId: number) {
    const order = await this.getOrderDetails(orderId);
    return {
      invoiceNumber: `INV-${order.id}`,
      date: order.createdAt,
      items: order.items,
      totalAmount: order.totalAmount,
      shipping: order.shippingFee,
      gst: order.gst,
    };
  }
}
