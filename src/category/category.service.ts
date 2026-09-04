import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Category from 'src/entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category_repository: Repository<Category>,
  ) {}

  async create(data: CreateCategoryDto) {
    const newCategory = this.category_repository.create(data);
    return await this.category_repository.save(newCategory);
  }

  async delete(id: number) {
    const deleteResult = await this.category_repository.delete(id);
    return deleteResult.affected;
  }

  categoryIdParser (id: string[] | string) {
    let parser: string | string[] = ""
    const validate = id.indexOf("[") != -1 ? true : false
    if (validate) {
      parser = JSON.parse(id as string)
      console.log("x")
      return parser
    }else {
      parser = id
      console.log("c")
      return parser
    }
  }

  async findCategoryById(id: string | string[]) {
    const parsResult = this.categoryIdParser(id)
    const findCat = await this.category_repository.findBy({
      id: In(Array.isArray(parsResult) ? parsResult : [parsResult]),
    });
    return findCat;
  }

  async getList() {
    const list = await this.category_repository.find();
    return list;
  }
}
