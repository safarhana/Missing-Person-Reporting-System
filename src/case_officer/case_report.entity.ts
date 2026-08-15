import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CaseOfficerEntity } from './case_officer.entity';

@Entity('case_reports')
export class CaseReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 255 })
  lastSeenLocation: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 30 })
  contactNumber: string;

  @Column({ type: 'varchar', default: 'Active' })
  status: string;

  @Column({ type: 'json', nullable: true })
  notes: { noteText: string; addedBy: string; date: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => CaseOfficerEntity,
    (officer) => officer.cases,
    { onDelete: 'CASCADE', nullable: true },
  )
  officer: CaseOfficerEntity;


}
