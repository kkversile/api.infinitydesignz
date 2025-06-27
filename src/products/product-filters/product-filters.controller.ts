import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductFiltersService } from './product-filters.service';
import { CreateProductfiltersDto, UpdateProductfiltersDto } from './dto';

@Controller('product-filters')
export class ProductFiltersController {
  constructor(private readonly productFiltersService: ProductFiltersService) {}

  @Post()
  create(@Body() dto: CreateProductfiltersDto) {
    return this.productFiltersService.create(dto);
  }

  @Get()
  findAll() {
    return this.productFiltersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFiltersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductfiltersDto) {
    return this.productFiltersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFiltersService.remove(+id);
  }
}