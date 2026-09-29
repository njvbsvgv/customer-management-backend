import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserActivity from './user-activity.entity';
import { Cart } from './cart.entity';

@Entity('users')
export default class Users {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ default: '' })
  photo!: string;

  @Column({ type: 'date', nullable: true })
  createAt!: Date;

  @Column({ default: '' })
  phoneNumber!: string;

  @Column({ default: 'notActive' })
  status!: string;

  @Column({ default: '' })
  address!: string;

  @Column({ default: '' })
  note!: string;

  @Column({
    type: 'jsonb',
    default: {
      totalSpent: 0,
      averageOrder: 0,
      lastOrderDate: '',
    },
  })
  totalData!: {
    totalSpent: number;
    averageOrder: number;
    lastOrderDate: string;
  };

  @Column({ type: 'jsonb', default: ['user'] })
  role!: string[];

  @Column({ select: true })
  password!: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart;

  @OneToMany(() => UserActivity, (activity) => activity.user)
  activities!: UserActivity[];

  @Column({ type: 'timestamptz', nullable: true })
  lastOrderDate!: Date | null;
}
