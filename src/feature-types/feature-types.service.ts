import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeatureTypesService {
  constructor(private prisma: PrismaService) {}

  private normalizeName(name: string) {
    return (name ?? '').trim();
  }

  /** Create FeatureType with name */
  async create(data: { name: string }) {
    const name = this.normalizeName(data.name);
    if (!name) throw new BadRequestException('Name is required');

    // Pre-check (helps surface a friendly error & avoids obvious dupes)
    const exists = await this.prisma.featureType.findUnique({ where: { name } });
    if (exists) throw new BadRequestException('Feature Type name already exists');

    try {
      const featureType = await this.prisma.featureType.create({ data: { name } });
      return {
        message: 'Feature Type created successfully',
        data: featureType,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        // Race condition fallback
        throw new BadRequestException('Feature Type name already exists');
      }
      throw e;
    }
  }

  /** Get all FeatureTypes */
  findAll() {
    return this.prisma.featureType.findMany({
      orderBy: { id: 'desc' },
    });
  }

  /** Get one FeatureType by ID */
  async findOne(id: number) {
    const featureType = await this.prisma.featureType.findUnique({ where: { id } });
    if (!featureType) throw new NotFoundException('Feature Type not found');
    return featureType;
  }

  /** Update FeatureType by ID */
  async update(id: number, data: any) {
    await this.findOne(id); // ensure exists

    const payload: any = { ...data };

    if (typeof payload.name === 'string') {
      payload.name = this.normalizeName(payload.name);
      if (!payload.name) throw new BadRequestException('Name cannot be empty');

      // Prevent renaming to an existing name on a different row
      const conflict = await this.prisma.featureType.findFirst({
        where: { name: payload.name, NOT: { id } },
        select: { id: true },
      });
      if (conflict) throw new BadRequestException('Feature Type name already exists');
    }

    try {
      const updated = await this.prisma.featureType.update({
        where: { id },
        data: payload,
      });
      return { message: 'Feature Type updated successfully', data: updated };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Feature Type name already exists');
      }
      throw e;
    }
  }

  /** Remove FeatureType + nested FeatureSets + FeatureLists + ProductFeatures */
  async remove(id: number) {
    //  Step 1: Ensure featureType exists
    const featureType = await this.prisma.featureType.findUnique({ where: { id } });
    if (!featureType) throw new NotFoundException('Feature Type not found');

    //  Step 2: Check if linked to any categories
    const categories = await this.prisma.category.findMany({
      where: { featureTypeId: id },
      select: { id: true, title: true },
    });

    if (categories.length > 0) {
      const usage = categories.map((c) => `#${c.id} (${c.title})`).join(', ');
      throw new BadRequestException(
        `This feature type is used by categories: ${usage}. Please reassign them before deletion.`,
      );
    }

    //  Step 3: Find all related FeatureSets
    const featureSets = await this.prisma.featureSet.findMany({
      where: { featureTypeId: id },
      select: { id: true },
    });

    const featureSetIds = featureSets.map((fs) => fs.id);

    if (featureSetIds.length > 0) {
      //  Step 4: Get all related FeatureLists
      const featureLists = await this.prisma.featureList.findMany({
        where: { featureSetId: { in: featureSetIds } },
        select: { id: true },
      });

      const featureListIds = featureLists.map((fl) => fl.id);

      if (featureListIds.length > 0) {
        //  Step 5: Delete all related ProductFeature entries
        await this.prisma.productFeature.deleteMany({
          where: { featureListId: { in: featureListIds } },
        });

        //  Step 6: Delete all FeatureLists
        await this.prisma.featureList.deleteMany({
          where: { id: { in: featureListIds } },
        });
      }

      //  Step 7: Delete all FeatureSets
      await this.prisma.featureSet.deleteMany({
        where: { id: { in: featureSetIds } },
      });
    }

    //  Step 8: Delete the FeatureType
    await this.prisma.featureType.delete({ where: { id } });

    return { message: 'Feature Type deleted successfully' };
  }
}
