import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/interfaces/auth-response.interface';
import { CreateModelDto } from './dto/create-model.dto';
import { FindModelsQueryDto } from './dto/find-models-query.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelService } from './model.service';

@Controller('models')
@UseGuards(JwtAuthGuard)
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  create(
    @Body() createModelDto: CreateModelDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.modelService.create(createModelDto, user.id);
  }

  @Get()
  findAll(@Query() query: FindModelsQueryDto, @CurrentUser() user: AuthUser) {
    return this.modelService.findAll(query, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.modelService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModelDto: UpdateModelDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.modelService.update(id, updateModelDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.modelService.remove(id, user.id);
  }
}
