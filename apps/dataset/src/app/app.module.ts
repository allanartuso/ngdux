import { Module } from '@nestjs/common';
import { DatasetModule } from '../controllers/dataset/dataset.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatasetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
