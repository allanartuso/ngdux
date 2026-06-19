import { Module } from '@nestjs/common';
import { DatasetTypescriptService } from './dataset-typescript.service';
import { DatasetController } from './dataset.controller';

@Module({
  imports: [],
  controllers: [DatasetController],
  providers: [DatasetTypescriptService],
})
export class DatasetModule {}
