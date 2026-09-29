import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserActivity from 'src/entities/user-activity.entity';
import { dateGenerator } from 'src/utils/dateService';
import { Repository } from 'typeorm';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly activity_respository: Repository<UserActivity>,
  ) {}

  async create(userId: string, createUserActivityDto: CreateUserActivityDto) {
    const newActivity = this.activity_respository.create({
      ...createUserActivityDto,
      createAt: dateGenerator(),
      user: { id: userId },
    });
    await this.activity_respository.save(newActivity);
  }

  async getActivityList() {
    return await this.activity_respository.find({relations: {user: false}});
  }

  async deleteActivity(id: string) {
    const deleteResult = await this.activity_respository.delete({ id });
    return deleteResult.affected;
  }
}
