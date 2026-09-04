import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import successMessageHandler from 'src/utils/successMessageHandler';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import customError from 'src/utils/customError';

@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Post('create')
  async create(@Body() data: CreateCategoryDto) {
    const createResult = await this.CategoryService.create(data);
    return successMessageHandler('create a new category successfully', 201);
  }

  @Get()
  async getList() {
    const list = await this.CategoryService.getList();
    return successMessageHandler(
      { data: list, message: 'get category list successfully', totalCount: list.length },
      200,
    );
  }

  @Delete("delete/:id")
  async delete (@Param() id: number) {
    try {
      const deleteResult = await this.CategoryService.delete(id)
      if (deleteResult) {
        return successMessageHandler("delete category successfully", 200)
      }else {
        customError("Sorry, the category was not deleted; please try again.", 500)
      }
    }catch (error) {
      customError("This category is used in a product and cannot be deleted.", 400)
    }
  }
}
