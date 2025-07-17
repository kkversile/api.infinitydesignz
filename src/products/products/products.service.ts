// src/products/products.service.ts

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductsDto, UpdateProductsDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductsDto) {
    const {
      sku,
      title,
      description,
      brandId,
      categoryId,
      colorId,
      sizeId,
      stock,
      mrp,
      sellingPrice,
      searchKeywords,
      status = true,
      productDetails,
      variants = [],
    } = dto;

    // duplicate SKU?
    if (await this.prisma.product.findUnique({ where: { sku } })) {
      throw new BadRequestException(`Product with SKU '${sku}' already exists.`);
    }

    // validate FKs
    const checks = [
      { id: brandId,    label: 'Brand',    model: this.prisma.brand },
      { id: categoryId, label: 'Category', model: this.prisma.category },
      { id: sizeId,     label: 'Size',     model: this.prisma.sizeUOM },
      { id: colorId,    label: 'Color',    model: this.prisma.color },
    ];
    for (const { id, label, model } of checks) {
      if (id != null && !(await (model as any).findUnique({ where: { id } }))) {
        throw new BadRequestException(`${label} with ID '${id}' does not exist.`);
      }
    }

    try {
      return await this.prisma.product.create({
        data: {
          sku,
          title,
          description,
          searchKeywords,
          status,
          stock,
          mrp,
          sellingPrice,

          brand:    { connect: { id: brandId } },
          category: { connect: { id: categoryId } },
          ...(sizeId  != null && { size:  { connect: { id: sizeId  } } }),
          ...(colorId != null && { color: { connect: { id: colorId } } }),

          productDetails: productDetails
            ? {
                create: {
                  model:            productDetails.model,
                  weight:           productDetails.weight,
                  sla:              productDetails.sla,
                  deliveryCharges:  productDetails.deliveryCharges,
                },
              }
            : undefined,

          variants: variants.length
            ? {
                create: variants.map(v => ({
                  sku:          v.sku,
                  stock:        v.stock,
                  mrp:          v.mrp,
                  sellingPrice: v.sellingPrice,
                  ...(v.sizeId  != null && { size:  { connect: { id: v.sizeId  } } }),
                  ...(v.colorId != null && { color: { connect: { id: v.colorId } } }),
                })),
              }
            : undefined,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { id: 'desc' },
      include: {
        category: {
          include: {
            featureType: {
              include: {
                featureSets: { include: { featureLists: true } }
              }
            },
            filterType: {
              include: {
                filterSets:  { include: { filterLists: true } }
              }
            }
          }
        },
        brand:          true,
        color:          true,
        size:           true,
        productDetails: true,
        variants:       { include: { size: true, color: true } },
        images:         true,
        filters:        true,
        features:       true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            featureType: {
              include: {
                featureSets: { include: { featureLists: true } }
              }
            },
            filterType: {
              include: {
                filterSets:  { include: { filterLists: true } }
              }
            }
          }
        },
        brand:          true,
        color:          true,
        size:           true,
        productDetails: true,
        variants:       { include: { size: true, color: true } },
        images:         true,
        filters:        true,
        features:       true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return product;
  }

  async findIdsOnly() {
    return this.prisma.product.findMany({
      select: { id: true, title: true },
    });
  }

  async exists(id: number) {
    const p = await this.prisma.product.findUnique({
      where:  { id },
      select: { id: true },
    });
    return !!p;
  }

  async update(id: number, dto: UpdateProductsDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    const {
      sku,
      title,
      description,
      brandId,
      categoryId,
      colorId,
      sizeId,
      stock,
      mrp,
      sellingPrice,
      searchKeywords,
      status,
      productDetails,
      variants = [],
    } = dto;

    if (sku) {
      const dup = await this.prisma.product.findFirst({
        where: { sku, NOT: { id } },
      });
      if (dup) {
        throw new BadRequestException(`Another product with SKU '${sku}' exists.`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        sku,
        title,
        description,
        searchKeywords,
        status,
        stock,
        mrp,
        sellingPrice,

        ...(brandId     != null && { brand:    { connect: { id: brandId } } }),
        ...(categoryId  != null && { category: { connect: { id: categoryId } } }),
        ...(sizeId      != null && { size:     { connect: { id: sizeId  } } }),
        ...(colorId     != null && { color:    { connect: { id: colorId } } }),

        productDetails: productDetails
          ? {
              upsert: {
                create: {
                  model:            productDetails.model,
                  weight:           productDetails.weight,
                  sla:              productDetails.sla,
                  deliveryCharges:  productDetails.deliveryCharges,
                },
                update: {
                  model:            productDetails.model,
                  weight:           productDetails.weight,
                  sla:              productDetails.sla,
                  deliveryCharges:  productDetails.deliveryCharges,
                },
              },
            }
          : undefined,

        variants: variants.length
          ? {
              deleteMany: {},
              create: variants.map(v => ({
                sku:          v.sku,
                stock:        v.stock,
                mrp:          v.mrp,
                sellingPrice: v.sellingPrice,
                ...(v.sizeId  != null && { size:  { connect: { id: v.sizeId  } } }),
                ...(v.colorId != null && { color: { connect: { id: v.colorId } } }),
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
