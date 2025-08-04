import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { AuthGuard } from "../auth/auth.guard";

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post()
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Patch()
  updateCart(@Req() req, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCart(req.user.id, dto);
  }

  @Delete(':variantId')
  removeItem(@Req() req, @Param('variantId') variantId: number) {
    return this.cartService.removeFromCart(req.user.id, +variantId);
  }

  @Post('sync')
  syncCart(@Req() req, @Body() dto: SyncCartDto) {
    return this.cartService.syncGuestCart(req.user.id, dto);
  }
}