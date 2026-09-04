import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import customError from 'src/utils/customError';
import successMessageHandler from 'src/utils/successMessageHandler';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { imageUploadInterceptor } from 'src/utils/mediaUploader';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Post('createProduct')
  @UseInterceptors(imageUploadInterceptor)
  async createProduct(
    @Body() data: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const newProduct = await this.productService.createProduct(data, image);
    return successMessageHandler(
      { product: newProduct, message: 'create a product successfully😍' },
      201,
    );
  }

  @Delete('deleteProduct/:id')
  async deleteProduct(@Param('id') id: number) {
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

  @Get(':id')
  async getProductById(@Param('id') id: number) {
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
}
