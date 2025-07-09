import { BadRequestException, Injectable, InternalServerErrorException  } from '@nestjs/common';
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
    sku,
    ...rest
  } = data;

  // ✅ Check for duplicate SKU
  const existing = await this.prisma.product.findUnique({ where: { sku } });
  if (existing) {
    throw new BadRequestException(`Product with SKU '${sku}' already exists.`);
  }

  // ✅ Validate top-level foreign key relations
  const relationChecks = [
    { id: brandId, label: 'Brand', model: this.prisma.brand },
    { id: mainCategoryId, label: 'Main Category', model: this.prisma.category },
    { id: subCategoryId, label: 'Sub Category', model: this.prisma.category },
    { id: listSubCategoryId, label: 'List Sub Category', model: this.prisma.category },
    { id: sizeId, label: 'Size', model: this.prisma.sizeUOM },
    { id: colorId, label: 'Color', model: this.prisma.color },
  ];

  for (const rel of relationChecks) {
    if (rel.id) {
       const exists = await (rel.model as any).findUnique({ where: { id: rel.id } });
      if (!exists) {
        throw new BadRequestException(`${rel.label} with ID '${rel.id}' does not exist.`);
      }
    }
  }

  // ✅ Validate nested variant sizeId & colorId
  if (variants?.length) {
    for (const [index, variant] of variants.entries()) {
      if (variant.sizeId) {
        const size = await this.prisma.sizeUOM.findUnique({ where: { id: variant.sizeId } });
        if (!size) {
          throw new BadRequestException(`Variant[${index}] has invalid Size ID '${variant.sizeId}'.`);
        }
      }
      if (variant.colorId) {
        const color = await this.prisma.color.findUnique({ where: { id: variant.colorId } });
        if (!color) {
          throw new BadRequestException(`Variant[${index}] has invalid Color ID '${variant.colorId}'.`);
        }
      }
    }
  }

  // ✅ Create Product
  try {
    return await this.prisma.product.create({
      data: {
        sku,
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
  } catch (error) {
    throw new InternalServerErrorException('Something went wrong while creating the product.');
  }
}

  async findAll() {
    return this.prisma.product.findMany({
       orderBy: {
      id: 'desc', // ✅ Latest products first
    },
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
      sku,
      ...rest
    } = data;

    // ✅ Check SKU duplication on update (excluding current product)
    if (sku) {
      const existing = await this.prisma.product.findFirst({
        where: {
          sku,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException(`Another product with SKU '${sku}' already exists.`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        sku,
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
