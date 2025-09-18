import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilterListService {
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

  /** Create a new FilterList */
/** Create a new FilterList (unique label under filterSetId) */
async create(data: {
  label: string;
  priority: number;
  status?: boolean | 'true' | 'false' | 0 | 1 | '0' | '1';
  filterSetId: number | string;
}) {
  const filterSetId = this.toPosInt(data.filterSetId);
  if (!filterSetId) throw new BadRequestException('filterSetId is required and must be a positive integer.');

  const fs = await this.prisma.filterSet.findUnique({ where: { id: filterSetId } });
  if (!fs) throw new BadRequestException(`FilterSet ${filterSetId} does not exist.`);

  const label = (data.label ?? '').trim();
  if (!label) throw new BadRequestException('label is required');

  // ✅ uniqueness pre-check
  const duplicate = await this.prisma.filterList.findFirst({
    where: { filterSetId, label },
    select: { id: true },
  });
  if (duplicate) throw new BadRequestException('Label already exists for this Filter Set');

  const payload: any = {
    label,
    priority: Number(data.priority),
    filterSetId,
  };
  const status = this.normBool(data.status);
  if (status !== undefined) payload.status = status;

  try {
    const filterList = await this.prisma.filterList.create({ data: payload });
    return { message: 'Filter List created successfully', data: filterList };
  } catch (err: any) {
    if (err?.code === 'P2002') {
      // race-condition fallback for unique composite
      throw new BadRequestException('Label already exists for this Filter Set');
    }
    if (err?.code === 'P2003') {
      throw new BadRequestException('Invalid filterSetId: foreign key constraint failed');
    }
    throw err;
  }
}

  /** Get all filter lists with their parent FilterSet */
  findAll() {
    return this.prisma.filterList.findMany({
      include: { filterSet: true },
      orderBy: { id: 'desc' },
    });
  }

  /** Get one filter list by ID */
  async findOne(id: number) {
    const filterList = await this.prisma.filterList.findUnique({
      where: { id },
      include: { filterSet: true },
    });

    if (!filterList) throw new NotFoundException('Filter List not found');

    return filterList;
  }

  /** Update a filter list */
/** Update a filter list (unique label under filterSetId) */
async update(
  id: number,
  data: {
    label?: string;
    priority?: number | string;
    status?: boolean | 'true' | 'false' | 0 | 1 | '0' | '1';
    filterSetId?: number | string;
  },
) {
  const current = await this.findOne(id); // throws if not found

  const nextLabel =
    data.label !== undefined ? (data.label ?? '').trim() : current.label;
  if (!nextLabel) throw new BadRequestException('label cannot be empty');

  let nextFilterSetId = current.filterSetId;
  if ('filterSetId' in data) {
    const parsed = this.toPosInt(data.filterSetId);
    if (!parsed) throw new BadRequestException('filterSetId must be a positive integer when provided.');
    const exists = await this.prisma.filterSet.findUnique({ where: { id: parsed } });
    if (!exists) throw new BadRequestException(`FilterSet ${parsed} does not exist (filterSetId).`);
    nextFilterSetId = parsed;
  }

  // ✅ uniqueness pre-check excluding current row
  const conflict = await this.prisma.filterList.findFirst({
    where: { filterSetId: nextFilterSetId, label: nextLabel, NOT: { id } },
    select: { id: true },
  });
  if (conflict) throw new BadRequestException('Label already exists for this Filter Set');

  const payload: any = {
    ...(data.priority !== undefined && { priority: Number(data.priority) }),
    ...(data.label !== undefined && { label: nextLabel }),
    ...(nextFilterSetId !== current.filterSetId && { filterSetId: nextFilterSetId }),
  };
  const status = this.normBool(data.status);
  if (status !== undefined) payload.status = status;

  try {
    const updated = await this.prisma.filterList.update({ where: { id }, data: payload });
    return { message: 'Filter List updated successfully', data: updated };
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new BadRequestException('Label already exists for this Filter Set');
    }
    if (err?.code === 'P2003') {
      throw new BadRequestException('Invalid filterSetId: foreign key constraint failed');
    }
    throw err;
  }
}


  /** Delete a filter list and all associated product filters */
  async remove(id: number) {
    await this.findOne(id); // ensure exists

    // Step 1: Delete related ProductFilters
    await this.prisma.productFilter.deleteMany({
      where: { filterListId: id },
    });

    // Step 2: Delete the FilterList
    await this.prisma.filterList.delete({
      where: { id },
    });

    return {
      message: 'Filter List deleted successfully',
    };
  }
}
