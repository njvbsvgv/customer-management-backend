import { Body, Controller, Post } from '@nestjs/common';
import customError from '../utils/customError';
import successMessageHandler from '../utils/successMessageHandler';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import { ResetPassStep1Dto, ResetPassStep2Dto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthServices: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const registerUserResult = await this.AuthServices.register(data);
    if (!registerUserResult) {
      customError('Wrong User!', 409);
    }
    return successMessageHandler('create user successfully😍', 201);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const userLoginResult = await this.AuthServices.login(data);
    if (userLoginResult) {
      return successMessageHandler(
        { message: 'login successfully😍', access_token: userLoginResult },
        200,
      );
    } else {
      customError('password is wrong!', 400);
    }
  }

  @Post("resetPassStep1")
  async resetPassStep1 (@Body() data: ResetPassStep1Dto) {
    const randomNumber = await this.AuthServices.resetPasswordStep1(data.email)
    return successMessageHandler({message: "successfully one step😍", confirmCode: randomNumber}, 200)
  }

  @Post("resetPassStep2")
  async resetPassStep2 (@Body() data: ResetPassStep2Dto) {
    await this.AuthServices.resetPasswordStep2(data)
    return successMessageHandler({message: "update password successfully✅"}, 200)
  }

  @Post("generateConfirmCode")
  async generateConfirmCode (@Body() data: ResetPassStep1Dto) {
    const confirmCode = await this.AuthServices.generateConfirmCode(data.email)
    if (!confirmCode) {
      customError("sory, confirmCode id not generated, please trying generate confirmCode", 405)
    }
    return successMessageHandler({message: "confirmCode generated✅", confirmCode}, 200)
  }
}
