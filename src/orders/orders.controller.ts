import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from "../auth/auth.guard";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post('place')
  placeOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.placeOrder(dto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getOrder(@Param('id') id: number) {
    return this.ordersService.getOrderDetails(+id);
  }

  @UseGuards(AuthGuard)
  @Get()
  listOrders(@Req() req: any) {
    return this.ordersService.listOrders(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('invoice/:id')
  generateInvoice(@Param('id') id: number) {
    return this.ordersService.generateInvoice(+id);
  }
}