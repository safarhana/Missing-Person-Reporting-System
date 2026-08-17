import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { Admin } from '../admin/admin.entity';
import { Mpr } from '../missing_person_reporter/mpr.entity';

@Entity('volunteer')
export class VolunteerEntity {

  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(Math.random() * 900000);
  }

  @Column({
      type: 'varchar',
      length: 100,
      unique: true,
      nullable: true,
    })
    username: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  phone: string;

   @Column({
    type: 'varchar',
    nullable: true,
   })
   email: string;

  @ManyToOne(
    () => Admin,
    (admin) => admin.volunteers,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  admin: Admin;

  @ManyToMany(() => Mpr, (mpr) => mpr.volunteers)
  @JoinTable()
  mprs: Mpr[];
}