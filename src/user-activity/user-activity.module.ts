import { Module } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { UserActivityController } from './user-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserActivity from 'src/entities/user-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity])],
  controllers: [UserActivityController],
  providers: [UserActivityService],
  exports: [UserActivityService]
})
export class UserActivityModule {}
