import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,

} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async getAddresses(userId: number) {
    return this.prisma.address.findMany({ where: { userId } });
  }

  async createAddress(userId: number, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
      },
    });
  }
  async updateAddress(
    userId: number,
    addressId: number,
    dto: UpdateAddressDto
  ) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) throw new NotFoundException("Address not found");
    if (address.userId !== userId)
      throw new ForbiddenException("Access denied");

    //  If setting this address as default, unset previous defaults
    if (dto.default === true) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          NOT: { id: addressId },
        },
        data: { default: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

// === REPLACE WHOLE METHOD === #realcode
async deleteAddress(userId: number, addressId: number) {
  const address = await this.prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address) throw new NotFoundException("Address not found");
  if (address.userId !== userId) throw new ForbiddenException("Access denied");

  // Block if it's the only address
  const count = await this.prisma.address.count({ where: { userId } });
  if (count <= 1) {
    throw new BadRequestException(
      "You cannot delete your only address. Please add another address first"
    );
  }

  // Block deleting the current default
  if (address.default) {
    throw new BadRequestException(
      "You cannot delete default. Please change the default address"
    );
  }

 await this.prisma.address.delete({ where: { id: addressId } });
  return { message: "Address deleted successfully." };
}

  async setDefaultAddress(userId: number, addressId: number) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException("Address not found or not owned by user");
    }

    // Unset previous default
    await this.prisma.address.updateMany({
      where: { userId },
      data: { default: false },
    });

    // Set new default
    return this.prisma.address.update({
      where: { id: addressId },
      data: { default: true },
    });
  }

  async getDefaultAddress(userId: number) {
  // Try to find explicitly marked default address
  const defaultAddress = await this.prisma.address.findFirst({
    where: { userId, default: true },
    orderBy: { createdAt: 'desc' }, // Optional: get latest if multiple marked default
  });

  if (defaultAddress) return defaultAddress;

  // Fallback: return latest address if none marked default
  const latestAddress = await this.prisma.address.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return latestAddress;
}

}
