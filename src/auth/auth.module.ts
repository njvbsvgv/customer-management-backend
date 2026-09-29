import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfiguration from '../core/config/jwtConfiguration';
import Users from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MediaService } from 'src/utils/mediaUploader';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), jwtConfiguration('SECRET_KEY'), UserModule],
  controllers: [AuthController],
  providers: [AuthService, MediaService],
})
export class AuthModule {}
