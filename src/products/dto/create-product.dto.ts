export class CreateProductDto {
  product_title!: string;
  description!: string;
  price!: number;
  rate!: string;
  categoryId!: string[];
}
