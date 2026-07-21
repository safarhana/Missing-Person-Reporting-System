import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,

 
  ManyToOne,
} from 'typeorm';


import { Admin } from '../admin/admin.entity';

@Entity('volunteer')
export class VolunteerEntity {

  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(Math.random() * 900000);
  }

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



  @ManyToOne(
    () => Admin,
    (admin) => admin.volunteers,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  admin: Admin;
}