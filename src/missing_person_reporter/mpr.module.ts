import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MprController } from './mpr.controller';
import { MprService } from './mpr.service';
import { Mpr } from './mpr.entity';
import { NoteEntity } from './note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mpr, NoteEntity])],
  controllers: [MprController],
  providers: [MprService],
})
export class MprModule {}