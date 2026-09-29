import { Controller, Delete, Get, Param } from '@nestjs/common';
import successMessageHandler from '../utils/successMessageHandler';
import { UserActivityService } from './user-activity.service';
import customError from '../utils/customError';

@Controller('activity')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Get('list')
  async getActivityList() {
    const list = await this.userActivityService.getActivityList();
    return successMessageHandler(
      {
        message: 'get activity list successfully😍✅',
        data: list,
        totalCount: list.length,
      },
      200,
    );
  }

  @Delete('delete/:id')
  async deleteActivity(@Param('id') id: string) {
    const deleteResult = await this.userActivityService.deleteActivity(id);
    if (deleteResult) {
      return successMessageHandler('delete activity successfully✅', 200);
    } else {
      customError('internal server error⚠️', 500);
    }
  }
}
