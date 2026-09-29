import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import successMessageHandler from 'src/utils/successMessageHandler';
import customError from 'src/utils/customError';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post('create')
  async create(@Body() data: CreateSizeDto) {
    const result = await this.sizeService.createSize(data);
    if (result) {
      return successMessageHandler(
        { message: 'create a new size successfully✅', data: result },
        201,
      );
    } else {
      customError('internal server error', 500);
    }
  }

  @Get('list')
  async getList() {
    const list = await this.sizeService.getSizeList();
    return successMessageHandler(
      {
        message: 'get size list successfully✅',
        data: { list, totalCount: list.length },
      },
      200,
    );
  }

  @Get('size/:id')
  async getSingleSize(@Param('id') id: string) {
    const result = await this.sizeService.getSizeById(id);
    return successMessageHandler(
      { message: 'get single size successfully✅', data: result },
      200,
    );
  }

  @Delete('remove/:id')
  async delete(@Param('id') id: string) {
    const findData = await this.sizeService.getSizeById(id);
    console.log("findData ==>", findData)
    if (findData) {
      const reslut = await this.sizeService.deleteSizeById(id);
      if (reslut.affected) {
        return successMessageHandler('delete a size successfully', 200);
      } else {
        customError('internal server error', 500);
      }
    }
  }
}
