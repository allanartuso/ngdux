import { Module } from '@nestjs/common';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';

@Module({
  imports: [],
  controllers: [DatasetController],
  providers: [DatasetService],
})
export class DatasetModule {}
