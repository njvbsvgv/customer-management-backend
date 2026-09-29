import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Products from './product.entity';

@Entity('Category')
export default class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false, default: "" })
  image!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ default: '' })
  description!: string;

  @Column({ default: 1, nullable: false })
  rate!: number;

  @ManyToMany(() => Products, (product) => product.category)
  products!: Products[];
}
