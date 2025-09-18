import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureListService {
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

/** Create a new FeatureList */
async create(data: {
  label: string;
  priority: number;
  status?: boolean | 'true' | 'false' | 0 | 1 | '0' | '1';
  featureSetId: number | string;
}) {
  const featureSetId = this.toPosInt(data.featureSetId);
  if (!featureSetId) {
    throw new BadRequestException('featureSetId is required and must be a positive integer.');
  }
  const fs = await this.prisma.featureSet.findUnique({ where: { id: featureSetId } });
  if (!fs) {
    throw new BadRequestException(`FeatureSet ${featureSetId} does not exist.`);
  }

  const label = (data.label ?? '').trim();
  if (!label) throw new BadRequestException('label is required');

  // ✅ Uniqueness pre-check (label per featureSetId)
  const duplicate = await this.prisma.featureList.findFirst({
    where: { featureSetId, label },
    select: { id: true },
  });
  if (duplicate) {
    throw new BadRequestException('Label already exists for this Feature Set');
  }

  const payload: any = {
    label,
    priority: Number(data.priority),
    featureSetId,
  };
  const status = this.normBool(data.status);
  if (status !== undefined) payload.status = status;

  try {
    const featureList = await this.prisma.featureList.create({ data: payload });
    return {
      message: 'Feature List created successfully',
      data: featureList,
    };
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new BadRequestException('Label already exists for this Feature Set');
    }
    if (err?.code === 'P2003') {
      throw new BadRequestException('Invalid featureSetId: foreign key constraint failed');
    }
    throw err;
  }
}

  /** Get all feature lists with their parent FeatureSet */
  findAll() {
    return this.prisma.featureList.findMany({
      include: { featureSet: true },
      orderBy: { id: 'desc' },
    });
  }

  /** Get one feature list by ID */
  async findOne(id: number) {
    const featureList = await this.prisma.featureList.findUnique({
      where: { id },
      include: { featureSet: true },
    });

    if (!featureList) throw new NotFoundException('Feature List not found');

    return featureList;
  }

/** Update a feature list */
async update(
  id: number,
  data: {
    label?: string;
    priority?: number | string;
    status?: boolean | 'true' | 'false' | 0 | 1 | '0' | '1';
    featureSetId?: number | string;
  },
) {
  const current = await this.findOne(id); // throws if not found

  const nextLabel = data.label !== undefined ? (data.label ?? '').trim() : current.label;
  if (!nextLabel) throw new BadRequestException('label cannot be empty');

  let nextFeatureSetId = current.featureSetId;
  if ('featureSetId' in data) {
    const parsed = this.toPosInt(data.featureSetId);
    if (!parsed) {
      throw new BadRequestException('featureSetId must be a positive integer when provided.');
    }
    const exists = await this.prisma.featureSet.findUnique({ where: { id: parsed } });
    if (!exists) {
      throw new BadRequestException(`FeatureSet ${parsed} does not exist (featureSetId).`);
    }
    nextFeatureSetId = parsed;
  }

  // ✅ Uniqueness pre-check (excluding current row)
  const conflict = await this.prisma.featureList.findFirst({
    where: {
      featureSetId: nextFeatureSetId,
      label: nextLabel,
      NOT: { id },
    },
    select: { id: true },
  });
  if (conflict) {
    throw new BadRequestException('Label already exists for this Feature Set');
  }

  const payload: any = {
    ...(data.priority !== undefined && { priority: Number(data.priority) }),
    ...(data.label !== undefined && { label: nextLabel }),
  };
  const status = this.normBool(data.status);
  if (status !== undefined) payload.status = status;
  if (nextFeatureSetId !== current.featureSetId) payload.featureSetId = nextFeatureSetId;

  try {
    const updated = await this.prisma.featureList.update({
      where: { id },
      data: payload,
    });

    return {
      message: 'Feature List updated successfully',
      data: updated,
    };
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new BadRequestException('Label already exists for this Feature Set');
    }
    if (err?.code === 'P2003') {
      throw new BadRequestException('Invalid featureSetId: foreign key constraint failed');
    }
    throw err;
  }
}

  /** Delete a feature list and all associated product features */
  async remove(id: number) {
    await this.findOne(id); // ensure exists

    //  Step 1: Delete related ProductFeatures
    await this.prisma.productFeature.deleteMany({
      where: { featureListId: id },
    });

    //  Step 2: Delete the FeatureList
    await this.prisma.featureList.delete({
      where: { id },
    });

    return {
      message: 'Feature List deleted successfully',
    };
  }
}
