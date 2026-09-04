import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Products from 'src/entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import Category from 'src/entities/category.entity';
import { MediaService } from 'src/utils/mediaUploader';
import Size from 'src/entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category, Size])],
  controllers: [ProductsController],
  providers: [ProductsService, CategoryService, MediaService],
})
export class ProductsModule {}
