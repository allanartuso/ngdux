import { Module } from '@nestjs/common';
import { AngularDocsDatasetService } from './angular-docs-dataset.service';
import { DatasetTypescriptService } from './dataset-typescript.service';
import { DatasetController } from './dataset.controller';

@Module({
  imports: [],
  controllers: [DatasetController],
  providers: [DatasetTypescriptService, AngularDocsDatasetService],
})
export class DatasetModule {}
