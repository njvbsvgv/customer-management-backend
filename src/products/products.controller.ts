import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import customError from 'src/utils/customError';
import { imageUploadInterceptor } from 'src/utils/mediaUploader';
import successMessageHandler from 'src/utils/successMessageHandler';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { ProductPaginationDto } from './dto/ProductPaginationDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('createProduct')
  @UseInterceptors(imageUploadInterceptor('photo'))
  async createProduct(
    @Body() data: CreateProductDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const newProduct = await this.productService.createProduct(data, photo);
    return successMessageHandler(
      { product: newProduct, message: 'create a product successfully😍' },
      201,
    );
  }

  @Post('addPhotoToGallery/:id')
  @UseInterceptors(imageUploadInterceptor('photo'))
  async createPhoto(
    @Param('id') id: string,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const updateResult = await this.productService.addPhotoToGallery(id, photo);
    if (updateResult?.affected) {
      return successMessageHandler('create image successfully✅😍', 201);
    }
  }

  @Delete('deleteProduct/:id')
  async deleteProduct(@Param('id') id: string) {
    const deleteResult = await this.productService.deleteProduct(id);
    if (deleteResult) {
      return successMessageHandler(
        { message: 'delete a product successfully✅' },
        200,
      );
    } else {
      customError('Failed to delete the product. Please try again', 400);
    }
  }

  @Delete('deleteAll')
  async deleteAll() {
    const deleteResult = await this.productService.deleteAllProduct();
    return successMessageHandler('delete all product successfully😍', 200);
  }

  @Get()
  async getProductList() {
    const list = await this.productService.getProductList();
    return successMessageHandler(
      {
        message: 'get product list successfully😍',
        list,
        totalCount: list.length,
        statusCode: 200,
      },
      200,
    );
  }

  @Get('single/:id')
  async getProductById(@Param('id') id: string) {
    const findResult = await this.productService.findProductById(id);
    if (findResult) {
      return successMessageHandler(
        { message: 'get a product successfully😍', data: findResult },
        200,
      );
    } else {
      customError('product is no found⚠️', 400);
    }
  }

  @Get('getByPagination')
  async getProductByPagination(
    @Query()
    data: ProductPaginationDto,
  ) {
    const result = await this.productService.getProductByPagination(data);
    return successMessageHandler(result, 200);
  }
}
