import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusFilter } from '../common-status/dto/status-query.dto';
import { statusWhere } from '../common-status/utils/status-where';

@Injectable()
export class FeatureSetService {
  constructor(private readonly prisma: PrismaService) {}

  // ── helpers (local) ─────────────────────────────────────────────
  private toPosInt(v: any): number | undefined {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return undefined;
    return n;
  }
  private normBool(v: any): boolean | undefined {
    if (v === undefined) return undefined;
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === '1' || v === 1) return true;
    if (v === 'false' || v === '0' || v === 0) return false;
    return undefined;
  }

 /** Create FeatureSet */
async create(data: {
  title: string;
  priority: number;
  status?: boolean;
  featureTypeId: number;
}) {
  // FK-safe: validate featureTypeId and ensure FeatureType exists
  const featureTypeId = this.toPosInt(data.featureTypeId);
  if (!featureTypeId) {
    throw new BadRequestException('featureTypeId is required and must be a positive integer.');
  }
  const ft = await this.prisma.featureType.findUnique({ where: { id: featureTypeId } });
  if (!ft) {
    throw new BadRequestException(`FeatureType ${featureTypeId} does not exist.`);
  }

  const title = (data.title ?? '').trim();
  if (!title) throw new BadRequestException('title is required');

  // ✅ Uniqueness pre-check (title per featureTypeId)
  const duplicate = await this.prisma.featureSet.findFirst({
    where: { featureTypeId, title },
    select: { id: true },
  });
  if (duplicate) {
    throw new BadRequestException('Title already exists for this Feature Type');
  }

  const payload: any = {
    title,
    priority: Number(data.priority),
    featureTypeId,
  };
  const status = this.normBool(data.status);
  if (status !== undefined) payload.status = status;

  try {
    const featureSet = await this.prisma.featureSet.create({ data: payload });
    return {
      message: 'Feature Set created successfully',
      data: featureSet,
    };
  } catch (err: any) {
    // Safety net for concurrent requests
    if (err?.code === 'P2002') {
      throw new BadRequestException('Title already exists for this Feature Type');
    }
    if (err?.code === 'P2003') {
      throw new BadRequestException('Invalid featureTypeId: foreign key constraint failed');
    }
    throw err;
  }
}


  /** Get all FeatureSets with their FeatureType */
  findAll(status: StatusFilter = 'active') {
    return this.prisma.featureSet.findMany({
      where: statusWhere(status),
      include: { featureType: true },
      orderBy: { id: 'desc' },
    });
  }

  /** Get a single FeatureSet by ID */
  async findOne(id: number) {
    const featureSet = await this.prisma.featureSet.findUnique({
      where: { id },
      include: { featureType: true },
    });

    if (!featureSet) throw new NotFoundException('Feature Set not found');
    return featureSet;
  }

  /** Update FeatureSet */

/** Update FeatureSet */
async update(id: number, data: {
  title?: string;
  priority?: number;
  status?: boolean;
  featureTypeId?: number;
}) {
  // Get current row (with featureType for context)
  const current = await this.findOne(id); // throws NotFound if missing

  // Resolve next values (normalize title, validate FT if changed)
  const nextTitle = data.title !== undefined ? (data.title ?? '').trim() : current.title;
  if (!nextTitle) throw new BadRequestException('title cannot be empty');

  let nextFeatureTypeId = current.featureTypeId;
  if ('featureTypeId' in data) {
    const parsed = this.toPosInt(data.featureTypeId);
    if (!parsed) {
      throw new BadRequestException('featureTypeId must be a positive integer when provided.');
    }
    const exists = await this.prisma.featureType.findUnique({ where: { id: parsed } });
    if (!exists) {
      throw new BadRequestException(`FeatureType ${parsed} does not exist (featureTypeId).`);
    }
    nextFeatureTypeId = parsed;
  }

  // ✅ Uniqueness pre-check excluding current row
  const conflict = await this.prisma.featureSet.findFirst({
    where: {
      featureTypeId: nextFeatureTypeId,
      title: nextTitle,
      NOT: { id },
    },
    select: { id: true },
  });
  if (conflict) {
    throw new BadRequestException('Title already exists for this Feature Type');
  }

  const payload: any = {
    ...(data.priority !== undefined && { priority: Number(data.priority) }),
    ...(data.title !== undefined && { title: nextTitle }),
  };
  const status = this.normBool(data.status);
  if (status !== undefined) payload.status = status;
  if (nextFeatureTypeId !== current.featureTypeId) payload.featureTypeId = nextFeatureTypeId;

  try {
    const updated = await this.prisma.featureSet.update({
      where: { id },
      data: payload,
    });

    return {
      message: 'Feature Set updated successfully',
      data: updated,
    };
  } catch (err: any) {
    // Safety net for concurrent requests
    if (err?.code === 'P2002') {
      throw new BadRequestException('Title already exists for this Feature Type');
    }
    if (err?.code === 'P2003') {
      throw new BadRequestException('Invalid featureTypeId: foreign key constraint failed');
    }
    throw err;
  }
}


  /** Delete FeatureSet + its FeatureLists + ProductFeatures (transactional) */
async remove(id: number) {
  // 1) Ensure FeatureSet exists
  const featureSet = await this.prisma.featureSet.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!featureSet) throw new NotFoundException('Feature Set not found');

  // 2) Find all related FeatureLists
  const featureLists = await this.prisma.featureList.findMany({
    where: { featureSetId: id },
    select: { id: true },
  });
  const featureListIds = featureLists.map((fl) => fl.id);

  // 3) Transaction: delete ProductFeatures -> FeatureLists -> FeatureSet
  await this.prisma.$transaction(async (tx) => {
    if (featureListIds.length > 0) {
      // 3a) Delete ProductFeatures for those lists
      await tx.productFeature.deleteMany({
        where: { featureListId: { in: featureListIds } },
      });

      // 3b) Delete FeatureLists
      await tx.featureList.deleteMany({
        where: { id: { in: featureListIds } },
      });
    }

    // 3c) Delete the FeatureSet itself
    await tx.featureSet.delete({ where: { id } });
  });

  return {
    message: 'Feature Set deleted successfully',
  };
}


}
