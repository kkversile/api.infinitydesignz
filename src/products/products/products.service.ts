import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductsDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

 async create(data: CreateProductsDto) {
  const {
    productDetails,
    variants,
    brandId,
    mainCategoryId,
    subCategoryId,
    listSubCategoryId,
    sizeId,
    colorId,
    ...rest
  } = data;

  return this.prisma.product.create({
    data: {
      ...rest,

      brand: { connect: { id: brandId } },
      mainCategory: mainCategoryId ? { connect: { id: mainCategoryId } } : undefined,
      subCategory: subCategoryId ? { connect: { id: subCategoryId } } : undefined,
      listSubCategory: listSubCategoryId ? { connect: { id: listSubCategoryId } } : undefined,
      size: sizeId ? { connect: { id: sizeId } } : undefined,
      color: colorId ? { connect: { id: colorId } } : undefined,

      productDetails: productDetails
        ? {
            create: {
              model: productDetails.model ?? '',
              weight: productDetails.weight,
              sla: productDetails.sla,
              deliveryCharges: productDetails.deliveryCharges,
            },
          }
        : undefined,

      variants: variants?.length
        ? {
            create: variants.map((v) => ({
              sku: v.sku,
              stock: v.stock,
              mrp: v.mrp,
              sellingPrice: v.sellingPrice,
              size: v.sizeId ? { connect: { id: v.sizeId } } : undefined,
              color: v.colorId ? { connect: { id: v.colorId } } : undefined,
            })),
          }
        : undefined,
    },
  });
}


  async findAll() {
    return this.prisma.product.findMany({
      include: {
        mainCategory: true,
        subCategory: true,
        listSubCategory: true,
        brand: true,
        color: true,
        size: true,
        productDetails: true,
        variants: {
          include: {
            size: true,
            color: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        mainCategory: true,
        subCategory: true,
        listSubCategory: true,
        brand: true,
        color: true,
        size: true,
        productDetails: true,
        variants: {
          include: {
            size: true,
            color: true,
          },
        },
        images: true,
        filters: true,
        features: true,
      },
    });
  }

  async findIdsOnly() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  async exists(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!product;
  }

async update(id: number, data: any) {
  const {
    productDetails,
    variants,
    brandId,
    mainCategoryId,
    subCategoryId,
    listSubCategoryId,
    sizeId,
    colorId,
    ...rest
  } = data;

  return this.prisma.product.update({
    where: { id },
    data: {
      ...rest,

      brand: { connect: { id: brandId } },
      mainCategory: mainCategoryId ? { connect: { id: mainCategoryId } } : undefined,
      subCategory: subCategoryId ? { connect: { id: subCategoryId } } : undefined,
      listSubCategory: listSubCategoryId ? { connect: { id: listSubCategoryId } } : undefined,
      size: sizeId ? { connect: { id: sizeId } } : undefined,
      color: colorId ? { connect: { id: colorId } } : undefined,

      productDetails: productDetails
        ? {
            upsert: {
              update: { ...productDetails },
              create: { ...productDetails },
            },
          }
        : undefined,

      variants: variants?.length
  ? {
      deleteMany: {},
      create: variants.map((v) => ({
        sku: v.sku,
        stock: v.stock,
        mrp: v.mrp,
        sellingPrice: v.sellingPrice,
        size: v.sizeId ? { connect: { id: v.sizeId } } : undefined,
        color: v.colorId ? { connect: { id: v.colorId } } : undefined,
      })),
    }
    : undefined,
    },
  });
}

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
