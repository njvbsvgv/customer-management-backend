import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Users from "./user.entity";
import Products from "./product.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Users, (user) => user.cart)
  @JoinColumn()
  user!: Users;

  @ManyToMany(() => Products)
  @JoinTable()
  products!: Products[];
}