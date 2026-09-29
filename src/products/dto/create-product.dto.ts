import Category from "../../entities/category.entity";

export class CreateProductDto {
  photo!: string;
  photo_list!: { id: string; url: string }[];
  category!: string[];
  product_title!: string;
  description!: string;
  price!: number;
  rate!: string;
  review!: number;
  stock!: number;
}
