import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LlmModel } from './entities/model.entity';
import { ModelController } from './model.controller';
import { ModelRepository } from './model.repository';
import { ModelService } from './model.service';

@Module({
  imports: [TypeOrmModule.forFeature([LlmModel])],
  controllers: [ModelController],
  providers: [ModelRepository, ModelService],
  exports: [ModelRepository],
})
export class ModelModule {}
