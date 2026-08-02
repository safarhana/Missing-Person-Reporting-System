import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Admin } from '../admin/admin.entity';
import { Mpr } from '../missing_person_reporter/mpr.entity';
import { CaseReportEntity } from './case_report.entity';

@Entity('case_officer')
export class CaseOfficerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  uniqueId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  joiningDate: Date;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'Unknown',
  })
  country: string;

  @Column({
    nullable: true,
  })
  file: string;

  @BeforeInsert()
  generateUniqueId() {
    this.uniqueId = randomUUID();
  }

  @ManyToMany(
    () => Admin,
    (admin) => admin.caseOfficers,
  )
  @JoinTable({ name: 'case_officer_admins' })
  admins: Admin[];

  @OneToMany(
    () => CaseReportEntity,
    (caseReport) => caseReport.officer,
  )
  cases: CaseReportEntity[];

  @OneToMany(
    () => Mpr,
    (mpr) => mpr.caseOfficer,
    { cascade: true },
  )
  mprs: Mpr[];


}