import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/common.error.filter';
import { AuthGuard } from 'src/common/guards/common.auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
@UseFilters(AllExceptionsFilter)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch()
  async updateUser(
    @Req() request,
    @Res() response,
    @Body('homeId') homeId: string
  ) {
    const userId = request.userId;

    try {
      const updatedHomeId = await this.userService.updateUser(homeId, userId);
      return response.status(HttpStatus.OK).json(updatedHomeId);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get()
  async getUser(@Req() request, @Res() response) {
    const userId = request.userId;

    try {
      const result = await this.userService.findOne(userId);
      const user = {
        name: result.name,
        userId: result.id,
        imgUrl: result.avatarUrl,
      };
      return response.status(HttpStatus.OK).json(user);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }
}
