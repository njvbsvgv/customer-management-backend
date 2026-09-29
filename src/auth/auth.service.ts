import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import {
  confirmCodeGenerator,
  verifyResetCode,
} from 'src/utils/confirmCodeService';
import customError from 'src/utils/customError';
import { comparePassword, hashPasswordHandler } from 'src/utils/hashPassword';
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import { ResetPassStep2Dto } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  confirmCode: number = 0;
  email: string = '';
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const findUser = await this.userService.findUserByEmail(data.email);
    if (findUser) {
      return false;
    } else {
      const hashedPassword = await hashPasswordHandler(data.password);
      return this.userService.createUser({ ...data, password: hashedPassword });
    }
  }

  async login(data: LoginDto) {
    const finUser = await this.userService.findUserByEmail(data.email);
    if (!finUser) {
      customError('user is not found!', 404);
    }
    const comparedPass = await comparePassword(
      data.password,
      finUser?.password || '',
    );
    // console.log("date ==>", date)
    console.log('comparedPass ==>', comparedPass);
    if (comparedPass) {
      const access_token = this.jwtService.sign({
        sub: finUser?.id,
        email: finUser?.email,
      });
      return access_token;
    } else {
      return false;
    }
  }

  async generateConfirmCode(email: string) {
    const findUser = await this.userService.findUserByEmail(email);
    this.confirmCode = confirmCodeGenerator(findUser?.id.toString() ?? '');
    console.log('confirmCode ==>', this.confirmCode);
    return this.confirmCode;
  }

  async resetPasswordStep1(email: string) {
    const findUser = await this.userService.findUserByEmail(email);
    this.email = email;
    if (findUser) {
      return this.generateConfirmCode(email);
    } else {
      customError('user is not found!', 40);
    }
  }

  async resetPasswordStep2(data: ResetPassStep2Dto) {
    const findUser = await this.userService.findUserByEmail(this.email);
    const isValid = verifyResetCode(
      findUser?.id.toString() ?? '',
      this.confirmCode,
    );
    if (!isValid.status) {
      customError(isValid.message, 400);
    } else {
      return await this.userService.updateUserPass(
        this.email,
        data.new_password,
      );
    }
  }
}
