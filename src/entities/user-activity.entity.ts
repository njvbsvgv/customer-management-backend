import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Users from './user.entity';

@Entity('userActivity')
export default class UserActivity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  createAt!: Date;

  @ManyToOne(() => Users, (user) => user.activities, {onDelete: "CASCADE"})
  user!: Users;
}
