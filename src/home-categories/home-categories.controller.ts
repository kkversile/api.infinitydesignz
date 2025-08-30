// home-categories.controller.ts
import { Body, Controller, Get, Put, Patch, Query } from '@nestjs/common';
import {
  RoomType,
  UpsertHomeCategoriesDto,
  ReorderHomeCategoriesDto,
  ToggleHomeCategoryDto,
} from './dto/upsert-home-categories.dto';
import { HomeCategoriesService } from './home-categories.service';

@Controller()
export class HomeCategoriesController {
  constructor(private readonly svc: HomeCategoriesService) {}

  @Get('home/categories')
  list(@Query('room') room?: RoomType) {
    const value =
      room && Object.values(RoomType).includes(room)
        ? room
        : RoomType.LivingRoom;
    return this.svc.listForRoom(value);
  }
  @Get('home/categories/all')
  listAll() {
    return this.svc.listAllRooms();
  }
  @Put('admin/home/categories')
  upsert(@Body() dto: UpsertHomeCategoriesDto) {
    return this.svc.upsertForRoom(dto);
  }

  @Patch('admin/home/categories/reorder')
  reorder(@Body() body: ReorderHomeCategoriesDto | string) {
    // Accept raw string bodies too
    const dto =
      typeof body === 'string' ? (JSON.parse(body) as ReorderHomeCategoriesDto) : body;
    return this.svc.reorderForRoom(dto);
  }

  @Patch('admin/home/categories/toggle')
  toggle(@Body() body: ToggleHomeCategoryDto | string) {
    const dto =
      typeof body === 'string' ? (JSON.parse(body) as ToggleHomeCategoryDto) : body;
    return this.svc.toggleForRoom(dto);
  }
}
