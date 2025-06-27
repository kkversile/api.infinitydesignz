import { Module } from '@nestjs/common';
import { ShippingPartnersService } from './shipping-partners.service';
import { ShippingPartnersController } from './shipping-partners.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShippingPartnersService],
  controllers: [ShippingPartnersController],
})
export class ShippingPartnersModule {}