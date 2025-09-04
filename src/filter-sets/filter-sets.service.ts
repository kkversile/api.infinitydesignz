import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusFilter } from '../common-status/dto/status-query.dto';
import { statusWhere } from '../common-status/utils/status-where';

@Injectable()
export class FilterSetService {
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

  /** Create FilterSet */
  async create(data: {
    title: string;
    priority: number;
    status?: boolean;
    filterTypeId: number;
  }) {
    // FK-safe: validate filterTypeId and ensure FilterType exists
    const filterTypeId = this.toPosInt(data.filterTypeId);
    if (!filterTypeId) {
      throw new BadRequestException('filterTypeId is required and must be a positive integer.');
    }
    const ft = await this.prisma.filterType.findUnique({ where: { id: filterTypeId } });
    if (!ft) {
      throw new BadRequestException(`FilterType ${filterTypeId} does not exist.`);
    }

    const payload: any = {
      title: data.title?.trim(),
      priority: Number(data.priority),
      filterTypeId,
    };
    const status = this.normBool(data.status);
    if (status !== undefined) payload.status = status;

    try {
      const filterSet = await this.prisma.filterSet.create({ data: payload });
      return {
        message: 'Filter Set created successfully',
        data: filterSet,
      };
    } catch (err: any) {
      if (err?.code === 'P2003') {
        throw new BadRequestException('Invalid filterTypeId: foreign key constraint failed');
      }
      throw err;
    }
  }

  /** Get all FilterSets with their FilterType */
  findAll(status: StatusFilter = 'active') {
    return this.prisma.filterSet.findMany({
      where: statusWhere(status),
      include: { filterType: true },
      orderBy: { id: 'desc' },
    });
  }

  /** Get a single FilterSet by ID */
  async findOne(id: number) {
    const filterSet = await this.prisma.filterSet.findUnique({
      where: { id },
      include: { filterType: true },
    });

    if (!filterSet) throw new NotFoundException('Filter Set not found');
    return filterSet;
  }

  /** Update FilterSet */
  async update(id: number, data: {
    title?: string;
    priority?: number;
    status?: boolean;
    filterTypeId?: number;
  }) {
    await this.findOne(id); // Ensure exists

    // Only touch filterTypeId if provided; validate target exists
    let nextFilterTypeId: number | undefined = undefined;
    if ('filterTypeId' in data) {
      const parsed = this.toPosInt(data.filterTypeId);
      if (!parsed) {
        throw new BadRequestException('filterTypeId must be a positive integer when provided.');
      }
      const exists = await this.prisma.filterType.findUnique({ where: { id: parsed } });
      if (!exists) {
        throw new BadRequestException(`FilterType ${parsed} does not exist (filterTypeId).`);
      }
      nextFilterTypeId = parsed;
    }

    const payload: any = {
      ...(data.title !== undefined && { title: data.title?.trim() }),
      ...(data.priority !== undefined && { priority: Number(data.priority) }),
    };
    const status = this.normBool(data.status);
    if (status !== undefined) payload.status = status;
    if (nextFilterTypeId !== undefined) payload.filterTypeId = nextFilterTypeId;

    try {
      const updated = await this.prisma.filterSet.update({
        where: { id },
        data: payload,
      });

      return {
        message: 'Filter Set updated successfully',
        data: updated,
      };
    } catch (err: any) {
      if (err?.code === 'P2003') {
        throw new BadRequestException('Invalid filterTypeId: foreign key constraint failed');
      }
      throw err;
    }
  }

  /** Delete FilterSet + its FilterLists + ProductFilters */
  async remove(id: number) {
    await this.findOne(id); // Ensure exists

    //  Step 1: Get all FilterLists under this FilterSet
    const filterLists = await this.prisma.filterList.findMany({
      where: { filterSetId: id },
      select: { id: true },
    });

    const filterListIds = filterLists.map((list) => list.id);

    if (filterListIds.length > 0) {
      //  Step 2: Delete related ProductFilters
      await this.prisma.productFilter.deleteMany({
        where: { filterListId: { in: filterListIds } },
      });

      //  Step 3: Delete FilterLists
      await this.prisma.filterList.deleteMany({
        where: { id: { in: filterListIds } },
      });
    }

    //  Step 4: Delete FilterSet
    await this.prisma.filterSet.delete({
      where: { id },
    });

    return {
      message: 'Filter Set deleted successfully',
    };
  }
}
