import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShippingPartnersService {
  constructor(private prisma: PrismaService) { }

  create(data: any) {
    return this.prisma.shippingPartner.create({ data });
  }

  findAll() {
    return this.prisma.shippingPartner.findMany();
  }

  findOne(id: number) {
    return this.prisma.shippingPartner.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.shippingPartner.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.shippingPartner.delete({ where: { id } });
  }
}