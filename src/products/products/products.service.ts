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

  // Check for existing SKU
  if (await this.prisma.product.findUnique({ where: { sku } })) {
    throw new BadRequestException(`Product with SKU '${sku}' already exists.`);
  }

  // Validate foreign keys only if provided
  const checks = [
    { id: brandId,    label: 'Brand',    model: this.prisma.brand },
    { id: categoryId, label: 'Category', model: this.prisma.category },
    { id: sizeId,     label: 'Size',     model: this.prisma.sizeUOM },
    { id: colorId,    label: 'Color',    model: this.prisma.color },
  ];
  for (const { id, label, model } of checks) {
    if (id && Number(id) > 0) {
      const exists = await (model as any).findUnique({ where: { id: Number(id) } });
      if (!exists) throw new BadRequestException(`${label} with ID '${id}' does not exist.`);
    }
  }

  try {
    const created = await this.prisma.product.create({
      data: {
        sku,
        title,
        description,
        searchKeywords,
        status,
        stock,
        mrp,
        sellingPrice,

        ...(brandId && Number(brandId) > 0 && { brand: { connect: { id: Number(brandId) } } }),
        ...(categoryId && { category: { connect: { id: Number(categoryId) } } }),
        ...(sizeId && Number(sizeId) > 0 && { size: { connect: { id: Number(sizeId) } } }),
        ...(colorId && Number(colorId) > 0 && { color: { connect: { id: Number(colorId) } } }),

        productDetails: productDetails
          ? {
              create: {
                model:           productDetails.model,
                weight:          productDetails.weight,
                sla:             productDetails.sla,
                deliveryCharges: productDetails.deliveryCharges,
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
                ...(v.sizeId && Number(v.sizeId) > 0 && {
                  size: { connect: { id: Number(v.sizeId) } },
                }),
                ...(v.colorId && Number(v.colorId) > 0 && {
                  color: { connect: { id: Number(v.colorId) } },
                }),
              })),
            }
          : undefined,
      },
    });

    return { message: 'Product created successfully', data: created };
  } catch (err) {
    console.error(err);
    throw new InternalServerErrorException('Error creating product');
  }
}

  async findAll() {
  const products = await this.prisma.product.findMany({
    orderBy: { id: 'desc' },
    include: {
      category: {
        include: {
          parent: {
            include: {
              parent: true,
            },
          },
          featureType: {
            include: {
              featureSets: {
                include: {
                  featureLists: true,
                },
              },
            },
          },
          filterType: {
            include: {
              filterSets: {
                include: {
                  filterLists: true,
                },
              },
            },
          },
        },
      },
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

  return products.map((product) => {
    const category = product.category;
    const parent = category?.parent;
    const grandparent = parent?.parent;

    const productImages = product.images.filter(img => img.variantId === null);
    const mainProductImage = productImages.find(img => img.isMain);
    const additionalProductImages = productImages.filter(img => !img.isMain);

    const variantImagesMap: Record<number, { main: any | null; additional: any[] }> = {};
    for (const v of product.variants) {
      const imgs = product.images.filter(img => img.variantId === v.id);
      variantImagesMap[v.id] = {
        main: imgs.find(img => img.isMain) || null,
        additional: imgs.filter(img => !img.isMain),
      };
    }

    return {
      ...product,
      mainCategoryTitle: grandparent?.title || null,
      mainCategoryId: grandparent?.id || null,
      subCategoryTitle: parent?.title || null,
      subCategoryId: parent?.id || null,
      listSubCategoryTitle: category?.title || null,
      listSubCategoryId: category?.id || null,
      images: {
        main: mainProductImage || null,
        additional: additionalProductImages,
        variants: variantImagesMap,
      }
    };
  });
}

  async findOne(id: number) {
  const product = await this.prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          parent: {
            include: {
              parent: true,
            },
          },
          featureType: {
            include: {
              featureSets: { include: { featureLists: true } },
            },
          },
          filterType: {
            include: {
              filterSets: { include: { filterLists: true } },
            },
          },
        },
      },
      brand: true,
      color: true,
      size: true,
      productDetails: true,
      variants: { include: { size: true, color: true } },
      images: true,
      filters: true,
      features: true,
    },
  });

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found.`);
  }

  const category = product.category;
  const parent = category?.parent;
  const grandparent = parent?.parent;

  const productImages = product.images.filter(img => img.variantId === null);
  const mainProductImage = productImages.find(img => img.isMain);
  const additionalProductImages = productImages.filter(img => !img.isMain);

  const variantImagesMap: Record<number, { main: any | null; additional: any[] }> = {};
  for (const v of product.variants) {
    const imgs = product.images.filter(img => img.variantId === v.id);
    variantImagesMap[v.id] = {
      main: imgs.find(img => img.isMain) || null,
      additional: imgs.filter(img => !img.isMain),
    };
  }

  return {
    ...product,
    mainCategoryTitle: grandparent?.title || null,
    mainCategoryId: grandparent?.id || null,
    subCategoryTitle: parent?.title || null,
    subCategoryId: parent?.id || null,
    listSubCategoryTitle: category?.title || null,
    listSubCategoryId: category?.id || null,
    images: {
      main: mainProductImage || null,
      additional: additionalProductImages,
      variants: variantImagesMap,
    },
  };
}


  async findIdsOnly() {
    const ids = await this.prisma.product.findMany({
      select: { id: true, title: true },
    });
    return   ids;
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

  // SKU duplication check
  if (sku) {
    const dup = await this.prisma.product.findFirst({
      where: { sku, NOT: { id } },
    });
    if (dup) {
      throw new BadRequestException(`Another product with SKU '${sku}' exists.`);
    }
  }

  // ✅ Validate existence of provided foreign keys
  const checks = [
    { id: brandId,    label: 'Brand',    model: this.prisma.brand },
    { id: categoryId, label: 'Category', model: this.prisma.category },
    { id: sizeId,     label: 'Size',     model: this.prisma.sizeUOM },
    { id: colorId,    label: 'Color',    model: this.prisma.color },
  ];
  for (const { id, label, model } of checks) {
    if (id && Number(id) > 0) {
      const exists = await (model as any).findUnique({ where: { id: Number(id) } });
      if (!exists) throw new BadRequestException(`${label} with ID '${id}' does not exist.`);
    }
  }

  const updated = await this.prisma.product.update({
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

      ...(brandId && Number(brandId) > 0 && { brand: { connect: { id: Number(brandId) } } }),
      ...(categoryId && Number(categoryId) > 0 && { category: { connect: { id: Number(categoryId) } } }),
      ...(sizeId && Number(sizeId) > 0 && { size: { connect: { id: Number(sizeId) } } }),
      ...(colorId && Number(colorId) > 0 && { color: { connect: { id: Number(colorId) } } }),

      productDetails: productDetails
        ? {
            upsert: {
              create: {
                model:           productDetails.model,
                weight:          productDetails.weight,
                sla:             productDetails.sla,
                deliveryCharges: productDetails.deliveryCharges,
              },
              update: {
                model:           productDetails.model,
                weight:          productDetails.weight,
                sla:             productDetails.sla,
                deliveryCharges: productDetails.deliveryCharges,
              },
            },
          }
        : undefined,

      variants: variants.length
        ? {
            deleteMany: {}, // clear existing
            create: variants.map(v => ({
              sku:          v.sku,
              stock:        v.stock,
              mrp:          v.mrp,
              sellingPrice: v.sellingPrice,
              ...(v.sizeId && Number(v.sizeId) > 0 && { size: { connect: { id: Number(v.sizeId) } } }),
              ...(v.colorId && Number(v.colorId) > 0 && { color: { connect: { id: Number(v.colorId) } } }),
            })),
          }
        : undefined,
    },
  });

  return { message: 'Product updated successfully', data: updated };
}

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
        features: true,
        filters: true,
        productDetails: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    const deleteOps = [];

    const variantImageIds = await this.prisma.image.findMany({
      where: { variantId: { in: product.variants.map(v => v.id) } },
      select: { id: true },
    });

    deleteOps.push(
      this.prisma.image.deleteMany({ where: { id: { in: variantImageIds.map(i => i.id) } } })
    );

    deleteOps.push(this.prisma.image.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.productFeature.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.productFilter.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.variant.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.productDetails.deleteMany({ where: { productId: id } }));
    deleteOps.push(this.prisma.product.delete({ where: { id } }));

    await this.prisma.$transaction(deleteOps);

    return { message: 'Product and related data deleted successfully' };
  }
}
