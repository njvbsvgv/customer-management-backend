import { Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Products from "./product.entity";

@Entity("size")
export default class Size {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToMany(() => Products, (products) => products.size)
    product!: Products[]
}