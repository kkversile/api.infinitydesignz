import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StatusFilter } from "../common-status/dto/status-query.dto";
import { statusWhere } from "../common-status/utils/status-where";

@Injectable()
export class SizeUOMService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; status?: boolean }) {
    const existing = await this.prisma.sizeUOM.findFirst({
      where: { title: data.title },
    });

    if (existing) {
      throw new BadRequestException(
        " Size UOM with this title already exists."
      );
    }

    const result = await this.prisma.sizeUOM.create({ data });
    return { message: "Size UOM created successfully.", sizeUOM: result };
  }

  findAll(status: StatusFilter = "active") {
    return this.prisma.sizeUOM.findMany({
      where: statusWhere(status),
      orderBy: { id: "desc" },
    });
  }

  async findOne(id: number) {
    const result = await this.prisma.sizeUOM.findUnique({ where: { id } });
    if (!result) {
      throw new BadRequestException(" Size UOM not found.");
    }
    return result;
  }

  async update(id: number, data: Partial<{ title: string; status: boolean }>) {
    if (data.title) {
      const existing = await this.prisma.sizeUOM.findFirst({
        where: {
          title: data.title,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException(
          " Another Size UOM with the same title already exists."
        );
      }
    }

    const updated = await this.prisma.sizeUOM.update({
      where: { id },
      data,
    });

    return { message: "Size UOM updated successfully.", sizeUOM: updated };
  }

  async remove(id: number) {
    const existing = await this.prisma.sizeUOM.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException(" Size UOM not found for deletion.");
    }

    await this.prisma.sizeUOM.delete({ where: { id } });
    return { message: "Size UOM deleted successfully." };
  }
}
