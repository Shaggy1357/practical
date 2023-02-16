import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum Roles {
  Admin = 'Admin',
  User = 'User',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: Roles.User })
  role: string;
}
