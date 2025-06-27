import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductDetailsService } from './product-details.service';
import { CreateProductdetailsDto, UpdateProductdetailsDto } from './dto';

@Controller('product-details')
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Post()
  create(@Body() dto: CreateProductdetailsDto) {
    return this.productDetailsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDetailsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductdetailsDto) {
    return this.productDetailsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDetailsService.remove(+id);
  }
}