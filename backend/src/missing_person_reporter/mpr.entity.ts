import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { NoteEntity } from './note.entity';

@Entity('mpr_users')
export class Mpr {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) 
  id: number;

  @Column({ type: 'varchar', length: 100 }) 
  fullName: string;

  @Column({ type: 'int', unsigned: true }) 
  age: number;

  @Column({ type: 'varchar', default: 'active' }) 
  status: 'active' | 'inactive';

  @ManyToMany(() => VolunteerEntity)
  volunteers: VolunteerEntity[];

  @OneToMany(() => NoteEntity, (note) => note.mpr, { cascade: true })
  notes: NoteEntity[];
}