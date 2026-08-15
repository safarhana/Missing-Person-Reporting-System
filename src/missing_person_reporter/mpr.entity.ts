import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { CaseOfficerEntity } from '../case_officer/case_officer.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => CaseOfficerEntity, (officer) => officer.mprs, { onDelete: 'CASCADE', nullable: true })
  caseOfficer: CaseOfficerEntity;

  @ManyToMany(
    () => VolunteerEntity,
    (volunteer) => volunteer.mprs,
  )
  @ManyToMany(() => VolunteerEntity)
  volunteers: VolunteerEntity[];

  @OneToMany(() => NoteEntity, (note) => note.mpr, { cascade: true })
  notes: NoteEntity[];
}