import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { CaseOfficerEntity } from '../case_officer/case_officer.entity';

@Entity()
export class Admin {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;


  @OneToMany(
    () => VolunteerEntity,
    (volunteer) => volunteer.admin,
  )
  volunteers: VolunteerEntity[];



  @ManyToMany(
    () => CaseOfficerEntity,
    (caseOfficer) => caseOfficer.admins,
  )
  @JoinTable()
  caseOfficers: CaseOfficerEntity[];
}