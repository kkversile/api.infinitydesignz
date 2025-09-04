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

    const payload: any = {
      title: data.title?.trim(),
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
  async update(id: number, data: {
    title?: string;
    priority?: number;
    status?: boolean;
    featureTypeId?: number;
  }) {
    await this.findOne(id); // ensure exists

    // Only touch featureTypeId if provided; validate target exists
    let nextFeatureTypeId: number | undefined = undefined;
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

    const payload: any = {
      ...(data.title !== undefined && { title: data.title?.trim() }),
      ...(data.priority !== undefined && { priority: Number(data.priority) }),
    };
    const status = this.normBool(data.status);
    if (status !== undefined) payload.status = status;
    if (nextFeatureTypeId !== undefined) payload.featureTypeId = nextFeatureTypeId;

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
      if (err?.code === 'P2003') {
        throw new BadRequestException('Invalid featureTypeId: foreign key constraint failed');
      }
      throw err;
    }
  }

  /** Delete FeatureSet + its FeatureLists + ProductFeatures */
  async remove(id: number) {
    await this.findOne(id); // ensure exists

    // Fetch FeatureLists under this FeatureSet
    const featureLists = await this.prisma.featureList.findMany({
      where: { featureSetId: id },
      select: { id: true },
    });
    const featureListIds = featureLists.map((l) => l.id);

    if (featureListIds.length > 0) {
      // 1) Delete related ProductFeatures
      await this.prisma.productFeature.deleteMany({
        where: { featureListId: { in: featureListIds } },
      });
      // 2) Delete FeatureLists
      await this.prisma.featureList.deleteMany({
        where: { id: { in: featureListIds } },
      });
    }

    // 3) Delete FeatureSet
    await this.prisma.featureSet.delete({ where: { id } });

    return {
      message: 'Feature Set deleted successfully',
    };
  }
}
