import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}