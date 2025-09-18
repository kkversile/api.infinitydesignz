import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilterTypesService {
  constructor(private prisma: PrismaService) {}

  private normalizeName(name: string) {
    return (name ?? '').trim();
  }

  /** Create FilterType (unique name) */
  async create(data: { name: string }) {
    const name = this.normalizeName(data.name);
    if (!name) throw new BadRequestException('Name is required');

    // Pre-check to give a clear 400 before hitting the DB
    const exists = await this.prisma.filterType.findUnique({ where: { name } });
    if (exists) throw new BadRequestException('Filter Type name already exists');

    try {
      const filterType = await this.prisma.filterType.create({ data: { name } });
      return { message: 'Filter Type created successfully', data: filterType };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        // Unique constraint race-condition fallback
        throw new BadRequestException('Filter Type name already exists');
      }
      throw e;
    }
  }

  /** List all FilterTypes */
  findAll() {
    return this.prisma.filterType.findMany({ orderBy: { id: 'desc' } });
  }

  /** Get one FilterType */
  async findOne(id: number) {
    const filterType = await this.prisma.filterType.findUnique({ where: { id } });
    if (!filterType) throw new NotFoundException('Filter Type not found');
    return filterType;
  }

  /** Update FilterType (unique name) */
  async update(id: number, data: any) {
    await this.findOne(id); // ensure exists

    const payload: any = { ...data };

    if (typeof payload.name === 'string') {
      payload.name = this.normalizeName(payload.name);
      if (!payload.name) throw new BadRequestException('Name cannot be empty');

      // Prevent renaming to an existing row's name
      const conflict = await this.prisma.filterType.findFirst({
        where: { name: payload.name, NOT: { id } },
        select: { id: true },
      });
      if (conflict) throw new BadRequestException('Filter Type name already exists');
    }

    try {
      const updated = await this.prisma.filterType.update({ where: { id }, data: payload });
      return { message: 'Filter Type updated successfully', data: updated };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Filter Type name already exists');
      }
      throw e;
    }
  }

  /** Delete FilterType and cascade delete sets/lists/productFilters */
  async remove(id: number) {
    //  Step 1: Ensure filterType exists
    const filterType = await this.prisma.filterType.findUnique({ where: { id } });
    if (!filterType) throw new NotFoundException('Filter Type not found');

    //  Step 2: Block if used by categories
    const categories = await this.prisma.category.findMany({
      where: { filterTypeId: id },
      select: { id: true, title: true },
    });
    if (categories.length > 0) {
      const usage = categories.map(c => `#${c.id} (${c.title})`).join(', ');
      throw new BadRequestException(
        `This filter type is used by categories: ${usage}. Please reassign them before deletion.`,
      );
    }

    //  Step 3: Fetch all FilterSets for this FilterType
    const filterSets = await this.prisma.filterSet.findMany({
      where: { filterTypeId: id },
      select: { id: true },
    });
    const filterSetIds = filterSets.map(fs => fs.id);

    if (filterSetIds.length > 0) {
      //  Step 4: Fetch all FilterLists under those FilterSets
      const filterLists = await this.prisma.filterList.findMany({
        where: { filterSetId: { in: filterSetIds } },
        select: { id: true },
      });
      const filterListIds = filterLists.map(fl => fl.id);

      if (filterListIds.length > 0) {
        //  Step 5: Delete related ProductFilters
        await this.prisma.productFilter.deleteMany({
          where: { filterListId: { in: filterListIds } },
        });

        //  Step 6: Delete FilterLists
        await this.prisma.filterList.deleteMany({
          where: { id: { in: filterListIds } },
        });
      }

      //  Step 7: Delete FilterSets
      await this.prisma.filterSet.deleteMany({
        where: { id: { in: filterSetIds } },
      });
    }

    //  Step 8: Delete the FilterType
    await this.prisma.filterType.delete({ where: { id } });

    return { message: 'Filter Type deleted successfully' };
  }
}
