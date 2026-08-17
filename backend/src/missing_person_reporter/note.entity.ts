import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mpr } from './mpr.entity';

@Entity('mpr_notes')
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Mpr, (mpr) => mpr.notes, { onDelete: 'CASCADE' })
  mpr: Mpr;
}