import { School } from 'src/school/entities/school.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  parentsName: string;

  @Column()
  address: string;

  @Column()
  std: string;

  @Column()
  photo: string;

  @Column()
  dob: Date;

  @Column()
  schoolId: number;

  @Column({ comment: '1=>Active 0=>inactive', default: 1 })
  isActive: number;
}
