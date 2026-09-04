import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import customError from 'src/utils/customError';
import { hashPasswordHandler } from 'src/utils/hashPassword';
import { MediaService } from 'src/utils/mediaUploader';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import UpdateUserDto from './dto/updateUser.dto';
import UserDto from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly user_repository: Repository<Users>,
    private readonly MediaService: MediaService,
  ) {}

  async findUserByEmail(email: string) {
    const findUser = await this.user_repository.findOne({ where: { email } });
    return findUser;
  }

  async findUserById(id: string) {
    const findUser = await this.user_repository.findOne({ where: { id } });
    return findUser;
  }

  async createUser(data: UserDto) {
    const findUserResult = await this.findUserByEmail(data.email);
    if (findUserResult) {
      return false;
    } else {
      const newUser = this.user_repository.create(data);
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
    console.log("newPass ==>", newPass)
    const findUser = await this.findUserByEmail(email);
    const hashPass = await hashPasswordHandler(newPass);
    console.log("hashPass ==>", hashPass)
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

  async getSingleUser(id: string) {
    const user = await this.findUserById(id);
    return user;
  }
}
