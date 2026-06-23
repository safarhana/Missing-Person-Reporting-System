import { Module } from '@nestjs/common';
import { MprController } from './mpr.controller';
import { MprService } from './mpr.service';

@Module({
  controllers: [MprController],
  providers: [MprService],
})
export class MprModule {}