import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Products from 'src/entities/product.entity';
import customError from 'src/utils/customError';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { MediaService } from 'src/utils/mediaUploader';
import { v4 as uuid } from 'uuid';
import Size from 'src/entities/size.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly product_repository: Repository<Products>,
    @InjectRepository(Size)
    private readonly size_repository: Repository<Size>,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
  ) {}

  async createProductSize () {

  }

  async createProduct(data: CreateProductDto, file: Express.Multer.File) {
    const avatar = await this.mediaService.uploadMedia(file, '/products');
    const newProduct = this.product_repository.create({
      ...data,
      photo: avatar.url,
      photo_list: [{ id: uuid(), url: avatar.url }],
    });
    const catData = await this.categoryService.findCategoryById(
      data.categoryId,
    );
    newProduct.category = catData;
    return await this.product_repository.save(newProduct);
  }

  async findProductById(id: number) {
    const findProduct = await this.product_repository.findOne({
      where: { id: id },
    });
    return findProduct;
  }

  async deleteProduct(id: number) {
    const findProduct = await this.findProductById(id);
    if (findProduct) {
      const deleteResult = await this.product_repository.delete({ id });
      console.log(deleteResult.affected);
      return deleteResult.affected ? true : false;
    } else {
      customError('product is not found⚠️', 404);
    }
  }

  async deleteAllProduct() {
    return await this.product_repository
      .createQueryBuilder()
      .delete()
      .execute();
  }

  async getProductList() {
    const list = await this.product_repository.find();
    return list;
  }
}
