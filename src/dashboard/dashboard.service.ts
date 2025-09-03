import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

type TopCategoryRow = { categoryId: number; productCount: bigint | number };
type TopSellerRow = { productId: number; sold: bigint | number; revenue: number };

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(days = 30) {
    const now = new Date();
    const newSince = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // ---------- Cards ----------
    const [
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      newProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await this.prisma.$transaction([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { stock: { gt: 0 }, status: true } }),
      this.prisma.product.count({ where: { stock: { lte: 0 } } }),
      this.prisma.product.count({ where: { createdAt: { gte: newSince } } }),
      this.prisma.category.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
      this.prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    // ---------- Top categories by product count (LIMIT 3) ----------
    // Uses table names from @@map: products, categories, order_items, orders
    const topCategoryRows =
      await this.prisma.$queryRaw<TopCategoryRow[]>`
        SELECT p.categoryId AS categoryId,
               COUNT(*)    AS productCount
        FROM products p
        GROUP BY p.categoryId
        ORDER BY productCount DESC
        LIMIT 3
      `;

    const topCategoryIds = topCategoryRows.map(r => r.categoryId);
    const topCategoriesMeta = topCategoryIds.length
      ? await this.prisma.category.findMany({
          where: { id: { in: topCategoryIds } },
          select: { id: true, title: true },
        })
      : [];

    const topCategories = topCategoryRows.map(row => {
      const meta = topCategoriesMeta.find(c => c.id === row.categoryId);
      const count =
        typeof row.productCount === 'bigint'
          ? Number(row.productCount)
          : row.productCount;
      return {
        id: row.categoryId,
        title: meta?.title ?? `Category #${row.categoryId}`,
        productCount: count,
      };
    });

    // ---------- Top 5 selling products in the last window ----------
    const topSellerRows =
      await this.prisma.$queryRaw<TopSellerRow[]>`
        SELECT oi.productId         AS productId,
               SUM(oi.quantity)     AS sold,
               SUM(oi.total)        AS revenue
        FROM order_items oi
        JOIN orders o ON o.id = oi.orderId
        WHERE oi.productId IS NOT NULL
          AND o.createdAt >= ${newSince}
        GROUP BY oi.productId
        ORDER BY sold DESC
        LIMIT 5
      `;

    const topSellerProductIds = topSellerRows.map(r => r.productId);
    const topProductsMeta = topSellerProductIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: topSellerProductIds } },
          select: {
            id: true,
            title: true,
            category: { select: { title: true } },
          },
        })
      : [];

    const topSellingProducts = topSellerRows.map(r => {
      const meta = topProductsMeta.find(p => p.id === r.productId);
      const sold = typeof r.sold === 'bigint' ? Number(r.sold) : r.sold;
      return {
        id: r.productId,
        title: meta?.title ?? `Product #${r.productId}`,
        category: meta?.category?.title ?? '—',
        sold,
        revenue: Number(r.revenue ?? 0),
      };
    });

    // ---------- Final payload ----------
    return {
      meta: { windowDays: days, generatedAt: now.toISOString() },
      cards: {
        products: {
          total: totalProducts,
          inStock: inStockProducts,
          new: newProducts,
          outOfStock: outOfStockProducts,
        },
        categories: {
          total: totalCategories,
          top: topCategories, // up to 3
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
      },
      tables: {
        topSellingProducts, // [{ id, title, category, sold, revenue }]
      },
    };
  }
}
