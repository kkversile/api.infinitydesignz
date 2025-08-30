// src/home-categories/home-categories.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RoomType,
  UpsertHomeCategoriesDto,
  ReorderHomeCategoriesDto,
  ToggleHomeCategoryDto,
} from './dto/upsert-home-categories.dto';
import { CATEGORY_IMAGE_PATH } from '../config/constants';

// --- Image formatting helpers: identical pattern to categories.service.ts ---
const formatImage = (fn: string | null | undefined) =>
  fn ? `${CATEGORY_IMAGE_PATH}${fn}` : null;

const formatCategoryResponse = (c: any) => ({
  ...c,
  mainImage: formatImage(c?.mainImage),
  appIcon:   formatImage(c?.appIcon),
  webImage:  formatImage(c?.webImage),
});

@Injectable()
export class HomeCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // ADD to src/home-categories/home-categories.service.ts

async listAllRooms() {
  // Fetch all active featured categories once
  const rows = await this.prisma.featuredCategory.findMany({
    where: { status: true },
    orderBy: [{ room: 'asc' }, { position: 'asc' }],
    include: { category: true },
  });

  // Prepare buckets for every RoomType, even if empty
  const byRoom = new Map<RoomType, any[]>();
  (Object.values(RoomType) as RoomType[]).forEach((r) => byRoom.set(r, []));

  for (const r of rows) {
    // Reuse the same formatting style as categories.service.ts
    const base   = formatCategoryResponse(r.category);
    const name   = r.titleOverride ?? (r.category as any).title ?? (r.category as any).name;
    const slug   = (r.category as any).slug ?? null;
    const img    = formatImage(r.imageOverride) ?? base.mainImage;

    byRoom.get(r.room as RoomType)!.push({
      id: r.category.id,
      name,
      slug,
      mainImage: img,          // absolute URL via CATEGORY_IMAGE_PATH
      appIcon: base.appIcon,   // absolute URL
      webImage: base.webImage, // absolute URL
      position: r.position,
    });
  }

  // Return as an array: [{ room: 'LivingRoom', items: [...] }, ...]
  return (Object.values(RoomType) as RoomType[]).map((room) => ({
    room,
    items: byRoom.get(room)!,
  }));
}

  // Homepage query: list formatted subcategories for a room
  async listForRoom(room: RoomType) {
    const rows = await this.prisma.featuredCategory.findMany({
      where: { room, status: true },
      orderBy: { position: 'asc' },
      include: {
        category: true, // expects fields: id, title/name, mainImage, appIcon, webImage, slug (if any)
      },
    });

    return rows.map((r) => {
      // Allow overrides for title/image
      const base = formatCategoryResponse(r.category);
      const name =
        r.titleOverride ?? (r.category as any).title ?? (r.category as any).name;

      // If a specific override image was provided for the card, use it as mainImage
      const mainImage = formatImage(r.imageOverride) ?? base.mainImage;

      return {
        id: r.category.id,
        name,
        slug: (r.category as any).slug ?? null,
        mainImage,               // formatted with CATEGORY_IMAGE_PATH
        appIcon: base.appIcon,   // formatted
        webImage: base.webImage, // formatted
        position: r.position,
      };
    });
  }

  // Admin: bulk upsert (position optional -> auto-increment)
  async upsertForRoom(dto: UpsertHomeCategoriesDto) {
    const ids = dto.items.map((i) => i.categoryId);

    // Validate: only second-level categories (depth == 2)
    const categories = await this.prisma.category.findMany({
      where: { id: { in: ids } },
      include: { parent: { include: { parent: true } } },
    });
    const invalid = categories.filter(
      (c) => !c.parentId || (c.parent && c.parent.parentId),
    );
    if (invalid.length) {
      throw new BadRequestException(
        `Only second-level categories allowed. Invalid: ${invalid
          .map((i) => i.id)
          .join(',')}`,
      );
    }

    const last = await this.prisma.featuredCategory.findFirst({
      where: { room: dto.room },
      orderBy: { position: 'desc' },
    });
    let nextPos = last ? last.position + 1 : 1;

    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const pos = item.position ?? nextPos++;
        await tx.featuredCategory.upsert({
          where: {
            room_categoryId: { room: dto.room, categoryId: item.categoryId },
          },
          update: { position: pos, status: item.status },
          create: {
            room: dto.room,
            categoryId: item.categoryId,
            position: pos,
            status: item.status,
          },
        });
      }
    });

    return { ok: true, count: dto.items.length };
  }

  // --- helpers to survive stringified bodies from some clients ---
  private parseMaybeString<T>(val: unknown): T {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val) as T;
      } catch {
        return (val as unknown) as T;
      }
    }
    return val as T;
  }
  private normItems(
    items: unknown,
  ): Array<{ categoryId: number; position: number }> {
    const parsed =
      this.parseMaybeString<Array<{ categoryId: number; position: number }>>(
        items,
      );
    return Array.isArray(parsed) ? parsed : [];
  }

  // Admin: drag-and-drop reorder
  async reorderForRoom(dto: ReorderHomeCategoriesDto) {
    const items = this.normItems(dto.items);
    if (!items.length) {
      throw new BadRequestException('items must be a non-empty array');
    }

    // Normalize to 1..N order
    const sorted = [...items]
      .sort((a, b) => a.position - b.position)
      .map((it, idx) => ({ categoryId: it.categoryId, position: idx + 1 }));

    await this.prisma.$transaction(async (tx) => {
      for (const it of sorted) {
        await tx.featuredCategory.update({
          where: {
            room_categoryId: { room: dto.room, categoryId: it.categoryId },
          },
          data: { position: it.position },
        });
      }
    });

    return { ok: true, count: sorted.length };
  }

  // Admin: quick enable/disable
  async toggleForRoom(dto: ToggleHomeCategoryDto) {
    const existing = await this.prisma.featuredCategory.findUnique({
      where: {
        room_categoryId: { room: dto.room, categoryId: dto.categoryId },
      },
    });
    if (!existing) {
      throw new NotFoundException('Featured category not found for this room');
    }

    await this.prisma.featuredCategory.update({
      where: {
        room_categoryId: { room: dto.room, categoryId: dto.categoryId },
      },
      data: { status: dto.status },
    });

    return { ok: true, categoryId: dto.categoryId, status: dto.status };
  }
}
