import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import { MediaService } from 'src/utils/mediaUploader';
import { UserActivityService } from 'src/user-activity/user-activity.service';
import { UserActivityModule } from 'src/user-activity/user-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UserActivityModule],
  controllers: [UserController],
  providers: [UserService, MediaService],
  exports: [UserService, MediaService]
})
export class UserModule {}
