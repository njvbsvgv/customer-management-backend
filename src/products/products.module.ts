import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Products from '../entities/product.entity';
import { CategoryService } from '../category/category.service';
import Category from '../entities/category.entity';
import { MediaService } from '../utils/mediaUploader';
import Size from '../entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category, Size])],
  controllers: [ProductsController],
  providers: [ProductsService, CategoryService, MediaService],
})
export class ProductsModule {}
