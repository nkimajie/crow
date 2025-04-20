import { Module } from '@nestjs/common';
import { UtilsService } from './services/utils/utils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
})
export class SharedModule {}
