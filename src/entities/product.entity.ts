import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './category.entity';
import Size from './size.entity';

@Entity('products')
export default class Products {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: false })
  photo!: string;

  @Column({ default: [], type: 'jsonb' })
  photo_list!: {id: string, url: string}[] | [];

  @Column({ length: 20, nullable: false })
  product_title!: string;

  @Column({ length: 500, nullable: false })
  description!: string;

  @Column({ nullable: false })
  price!: number;

  @Column({default: 2})
  rate!: string;

  @Column({default: 0})
  review!: number;

  @Column()
  categories!: string;
  
  @Column({default: 100})
  stock!: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'" })
  category!: Category[];

  @ManyToMany(() => Size, (size) => size.product)
  size!: Size[]
}
