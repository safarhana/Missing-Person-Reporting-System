import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,

  
  ManyToMany,
} from 'typeorm';


import { Admin } from '../admin/admin.entity';

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
  admins: Admin[];
}