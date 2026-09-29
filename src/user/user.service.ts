import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from '../entities/user.entity';
import customError from '../utils/customError';
import { dateGenerator } from '../utils/dateService';
import { hashPasswordHandler } from '../utils/hashPassword';
import { MediaService } from '../utils/mediaUploader';
import { Repository } from 'typeorm';
import UpdateUserDto from './dto/updateUser.dto';
import UserDto from './dto/user.dto';
import { UserActivityService } from '../user-activity/user-activity.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly user_repository: Repository<Users>,
    private readonly MediaService: MediaService,
    private readonly userActivityService: UserActivityService,
  ) {}

  async findUserByEmail(email: string) {
    const findUser = await this.user_repository.findOne({ where: { email } });
    return findUser;
  }

  async findUserById(id: string) {
    const findUser = await this.user_repository.findOne({ where: { id } });
    if (findUser) {
      return findUser;
    } else {
      customError('user not found⚠️', 404);
    }
  }

  async createUser(data: UserDto) {
    const findUserResult = await this.findUserByEmail(data.email);
    if (findUserResult) {
      return false;
    } else {
      const date = dateGenerator();
      console.log('date ==>', date);
      const newUser = this.user_repository.create({ ...data, createAt: date });
      await this.user_repository.save(newUser);
      return true;
    }
  }

  async remove(email: string) {
    return await this.user_repository.delete({ email });
  }

  async getUserList() {
    const userList = await this.user_repository.find();
    return userList;
  }

  async updateUserPass(email: string, newPass: string) {
    console.log('newPass ==>', newPass);
    const findUser = await this.findUserByEmail(email);
    const hashPass = await hashPasswordHandler(newPass);
    console.log('hashPass ==>', hashPass);
    return await this.user_repository.update(
      { id: findUser?.id },
      { password: hashPass },
    );
  }

  async updateUserInformation(id: string, data: UpdateUserDto) {
    const findUser = await this.findUserById(id);
    if (findUser) {
      const updateResult = await this.user_repository.update(id, data);
      return updateResult;
    } else {
      customError('user is not found!', 400);
    }
  }

  async createPhoto(userId: string, photo: Express.Multer.File) {
    const findUser = await this.findUserById(userId);
    if (findUser) {
      const image = await this.MediaService.uploadMedia(photo, '/users');
      const updateResult = await this.user_repository.update(
        { id: userId },
        { photo: image.url },
      );
      await this.userActivityService.create(userId, {
        title: 'create photo',
        description: 'create you photo',
      });
      return updateResult;
    }
  }

  async getSingleUser(id: string) {
    const user = await this.findUserById(id);
    return user;
  }
}
