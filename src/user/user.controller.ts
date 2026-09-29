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
import { imageUploadInterceptor } from 'src/utils/mediaUploader';
import successMessageHandler from 'src/utils/successMessageHandler';
import UpdateUserDto from './dto/updateUser.dto';
import UserDto from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('deleteUser')
  async delete(@Body() data: UserDto) {
    const deleted = await this.userService.remove(data.email);
    if (!deleted.affected) {
      customError('delete user is wrong', 401);
    }
    return successMessageHandler('delete user successfully😍✌️', 200);
  }

  @Get('userList')
  async getUserList() {
    const userList = await this.userService.getUserList();
    return successMessageHandler(
      { data: userList, totalCount: userList.length },
      200,
    );
  }

  @Post('updateInformation/:id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    const updateResult = await this.userService.updateUserInformation(id, data);
    if (updateResult?.affected) {
      return successMessageHandler(
        'update user information successfully✅',
        200,
      );
    } else {
      customError('internal server error🚫', 500);
    }
  }

  @Post('createPhoto/:id')
  @UseInterceptors(imageUploadInterceptor('photo'))
  async createPhoto(
    @Param('id') id: string,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const updateResult = await this.userService.createPhoto(id, photo);
    if (updateResult?.affected) {
      return successMessageHandler('create image successfully✅😍', 201);
    } else {
      customError('internal server error⚠️', 500);
    }
  }

  @Get('single/:id')
  async getSingleUser(@Param() data: { id: string; email: string }) {
    const findUser = await this.userService.getSingleUser(data.id);
    if (findUser) {
      return successMessageHandler(
        { message: 'get user successfully😍', data: findUser },
        200,
      );
    } else {
      customError('user is not found⚠️', 404);
    }
  }
}
