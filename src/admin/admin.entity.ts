import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';


@Entity()
export class Admin {

  @PrimaryColumn()
  id : number;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(Math.random() * 1000000);
  }


@Column({
  type: 'varchar',
  length: 100,
  unique: true,
})
username: string;

@Column({
  type:'varchar',
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
}