import { Controller, Get, Query,Post, Body, Param, Put, Delete,  UseGuards, Req,
BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto, UpdateProductsDto, } from './dto';
import { QueryProductsDto } from './query-products.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

 

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly jwtService: JwtService,
  ) {}
@UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductsDto) {
    console.log(dto);
    return this.productsService.create(dto);
  }
@UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

@Get('search')
async searchProducts(@Query() query: QueryProductsDto) {
  return this.productsService.searchProducts(query);
}
  
 @Get('details')
  async getProductDetails(
    @Req() req,
    @Query('productId') productId: string,
    @Query('variantId') variantId?: string,
  ) {
    if (!productId) throw new BadRequestException('productId is required');
    const userId = this.getOptionalUserId(req);
    return this.productsService.getProductDetails(
      parseInt(productId),
      variantId ? parseInt(variantId) : undefined,
      userId,
    );
  }

  private getOptionalUserId(req: any): number | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) return undefined;

    try {
      const payload: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload?.id ? Number(payload.id) : undefined;
    } catch {
      return undefined;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
@UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductsDto) {
    return this.productsService.update(+id, dto);
  }
@UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

 
}
