import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MainProductPromotionService } from './main-product-promotion.service';

@Controller('frontend/promotions') // public-facing route
export class PromotionsFrontendController {
  constructor(private readonly service: MainProductPromotionService) {}

  /**
   * GET /frontend/promotions?includeProducts=true&productsLimit=8
   *
   * Response:
   * {
   *   items: [
   *     {
   *       id, title, priority, imageUrl, displayCount,
   *       promotions: [
   *         {
   *           id, title, imageUrl, priority, ...,
   *           (products?: [ ... ])
   *         }
   *       ]
   *     }
   *   ]
   * }
   */
  @Get()
  async getAll(
    @Query('includeProducts', new DefaultValuePipe(false), ParseBoolPipe) includeProducts: boolean,
    @Query('productsLimit', new DefaultValuePipe(8), ParseIntPipe) productsLimit: number,
  ) {
    return this.service.getAllPromotionsAggregate({ includeProducts, productsLimit });
  }
}
