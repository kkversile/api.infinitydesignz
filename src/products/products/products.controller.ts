import { Controller, Get, Query,Post, Body, Param, Put, Delete,BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto, UpdateProductsDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductsDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }



  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductsDto) {
    return this.productsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

 @Get('search') // ✅ Now matches /products/search
  async searchProducts(
    @Query('mainCategoryId') mainCategoryId: string,
    @Query('subCategoryId') subCategoryId: string,
    @Query('listSubCatId') listSubCatId?: string,
    @Query('brandId') brandId?: string,
    @Query('searchStr') searchStr?: string,
    @Query('filters') filters?: string // JSON stringified
  ) {
    const parsed = {
      mainCategoryId: parseInt(mainCategoryId),
      subCategoryId: parseInt(subCategoryId),
      listSubCatId: listSubCatId ? parseInt(listSubCatId) : undefined,
      brandId: brandId ? parseInt(brandId) : undefined,
      searchStr,
      filters: filters || '{}', // ✅ Avoid JSON parse error on undefined
    };

    if ( isNaN(parsed.subCategoryId)) {
      throw new BadRequestException('categoryId and subCategoryId are required');
    }

    return this.productsService.getProducts(parsed);
  }
}