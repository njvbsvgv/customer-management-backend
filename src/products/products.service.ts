import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import Products from '../entities/product.entity';
import customError from '../utils/customError';
import { MediaService } from '../utils/mediaUploader';
import { Repository } from 'typeorm';
// import { v4 as uuid } from 'uuid';
import { randomUUID } from 'crypto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductPaginationDto } from './dto/ProductPaginationDto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly product_repository: Repository<Products>,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
  ) {}

  async createProduct(data: CreateProductDto, file: Express.Multer.File) {
    const avatar = await this.mediaService.uploadMedia(file, '/products');
    const catData = await this.categoryService.findCategoryById(data.category);
    const newProduct = this.product_repository.create({
      ...data,
      photo: avatar.url,
      photo_list: [{ id: randomUUID(), url: avatar.url }],
      subCategory: Array.isArray(catData) ? catData[0] : catData,
      category: catData,
    });
    return await this.product_repository.save(newProduct);
  }

  async addPhotoToGallery(id: string, photo: Express.Multer.File) {
    const findProduct = await this.findProductById(id);
    const avatar = await this.mediaService.uploadMedia(photo, '/products');
    if (findProduct) {
      return await this.product_repository.update(
        { id },
        {
          photo_list: [
            ...findProduct?.photo_list,
            { id: randomUUID(), url: avatar.url },
          ],
        },
      );
    }
  }

  async findProductById(id: string) {
    const findProduct = await this.product_repository.findOne({
      where: { id: id },
    });
    if (findProduct) {
      return findProduct;
    } else {
      customError('product not found⚠️', 404);
    }
  }

  async deleteProduct(id: string) {
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

  async getProductByPagination(data: ProductPaginationDto) {
    const {
      search,
      type,
      stock,
      minPrice,
      maxPrice,
      page = '1',
      limit = '10',
    } = data;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const query = this.product_repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Search
    if (search?.trim()) {
      query.andWhere('product.product_title ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    // Type → category.id
    if (type?.trim()) {
      query.andWhere('category.title = :categoryTitle', {
        categoryTitle: type.trim(),
      });
    }

    // Stock
    if (stock === 'true') {
      query.andWhere('product.stock > 0');
    }

    // Minimum price
    if (minPrice) {
      query.andWhere('product.price >= :minPrice', {
        minPrice: Number(minPrice),
      });
    }

    // Maximum price
    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', {
        maxPrice: Number(maxPrice),
      });
    }

    // Pagination
    query.skip((pageNumber - 1) * limitNumber).take(limitNumber);

    query.orderBy('product.id', 'DESC');

    const [products, total] = await query.getManyAndCount();

    return {
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber < Math.ceil(total / limitNumber),
        hasPreviousPage: pageNumber > 1,
      },
    };
  }
}
