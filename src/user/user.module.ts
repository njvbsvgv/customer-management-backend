import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from '../entities/user.entity';
import { MediaService } from '../utils/mediaUploader';
import { UserActivityService } from '../user-activity/user-activity.service';
import { UserActivityModule } from '../user-activity/user-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UserActivityModule],
  controllers: [UserController],
  providers: [UserService, MediaService],
  exports: [UserService, MediaService]
})
export class UserModule {}
