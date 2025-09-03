import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { StatusQueryDto } from "../common-status/dto/status-query.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ColorsService } from "./colors.service";
import { parseBooleanStatus } from "../utils/validate-status"; // adjust path

@Controller("colors")
export class ColorsController {
  constructor(private readonly service: ColorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: any) {
    dto.status = parseBooleanStatus(dto.status); //  sanitize
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() { status }: StatusQueryDto) {
    return this.service.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    dto.status = parseBooleanStatus(dto.status); //  sanitize
    return this.service.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
