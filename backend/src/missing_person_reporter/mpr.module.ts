import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MprController } from './mpr.controller';
import { MprService } from './mpr.service';
import { Mpr } from './mpr.entity';
import { NoteEntity } from './note.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mpr, NoteEntity]),
    ConfigModule,
  ],
  controllers: [MprController],
  providers: [MprService],
  exports: [MprService],
})
export class MprModule {}