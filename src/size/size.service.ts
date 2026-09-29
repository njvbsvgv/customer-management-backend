import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Size from '../entities/size.entity';
import { Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import customError from '../utils/customError';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly size_repository: Repository<Size>,
  ) {}

  async getSizeBySize(size: string) {
    return await this.size_repository.findOne({ where: { size } });
  }

  async createSize(data: CreateSizeDto) {
    const findData = await this.getSizeBySize(data.size)
    if (!findData) {
      const newSize = this.size_repository.create(data);
      return await this.size_repository.save(newSize);
    }else {
      customError("This size already exists⚠️", 400)
    }
  }

  async getSizeList() {
    return await this.size_repository.find();
  }

  async getSizeById(id: string) {
    const result = await this.size_repository.findOne({ where: { id } });
    if (result) {
      return result;
    } else {
      customError('size not found!', 404);
    }
  }

  async deleteSizeById(id: string) {
    return await this.size_repository.delete({ id });
  }
}
