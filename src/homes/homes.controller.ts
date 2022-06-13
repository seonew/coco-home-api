import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/common.error.filter';
import { AuthGuard } from 'src/common/guards/common.auth.guard';
import { HomeMembersService } from 'src/home-members/home-members.service';
import { CreateHomeTaskDto } from 'src/home-tasks/dto/create-home-task.dto';
import { UpdateHomeTaskDto } from 'src/home-tasks/dto/update-home-task.dto';
import { HomeTasksService } from 'src/home-tasks/home-tasks.service';
import { RefrigeratorFoodsService } from 'src/refrigerator-foods/refrigerator-foods.service';
import { UsersService } from 'src/users/users.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { HomesService } from './homes.service';

@Controller('homes')
@UseGuards(AuthGuard)
@UseFilters(AllExceptionsFilter)
export class HomesController {
  constructor(
    private readonly homeService: HomesService,
    private readonly homeMemberService: HomeMembersService,
    private readonly homeTaskService: HomeTasksService,
    private readonly userService: UsersService,
    private readonly refrigeratorFoodService: RefrigeratorFoodsService
  ) {}

  @Get()
  async fetchHomes(@Req() request, @Res() response) {
    const userId = request.userId;

    try {
      const homes = await this.homeService.fetchHomes(userId);
      return response.status(HttpStatus.OK).json(homes);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/:homeId/info')
  async fetchHomeInfo(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string
  ) {
    const userId = request.userId;

    try {
      const result = await this.homeService.fetchHomeInfo(homeId);

      const homes = await this.homeService.fetchHomes(userId);
      let nextHomeId = result.id;
      if (nextHomeId === '' && homes.length > 0) {
        nextHomeId = homes[0].homeId;
        await this.userService.updateUser(nextHomeId, userId);
      }

      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/members/users')
  async fetchHomeMembers(
    @Req() request,
    @Res() response,
    @Query('name') name: string
  ) {
    const userId = request.userId;

    try {
      const addUsers = await this.userService.findAllName(name);
      const result = await this.homeMemberService.fetchHomeMembers(
        userId,
        addUsers
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Post()
  async createHome(
    @Req() request,
    @Res() response,
    @Body() createHomeDto: CreateHomeDto
  ) {
    const userId = request.userId;

    try {
      createHomeDto.userId = userId;

      const result = await this.homeService.addHome(createHomeDto);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Patch('/:homeId')
  async updateHome(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string,
    @Body() updateHomeDto: UpdateHomeDto
  ) {
    try {
      updateHomeDto.id = homeId;

      await this.homeService.patchHome(updateHomeDto);
      return response.status(HttpStatus.OK).json({});
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Delete('/:id')
  async deleteHome(@Req() request, @Res() response, @Param() params) {
    const userId = request.userId;
    const { id } = params;

    try {
      await this.userService.updateOneByHomeId('', userId);
      await this.homeService.deleteHome(id);

      const nextHomes = await this.homeService.fetchHomes(userId);
      return response.status(HttpStatus.OK).json(nextHomes);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  // HOME TASK
  @Get('/:homeId/tasks/calendar')
  async fetchHomeTasks(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string,
    @Query() query
  ) {
    const { year, month } = query;

    try {
      const result = await this.homeTaskService.fetchHomeTasks(
        homeId,
        year,
        month
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/:homeId/task/detail')
  async fetchHomeTaskDetail(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string,
    @Query() query
  ) {
    const { year, month, day } = query;
    const startDate = new Date(year, month - 1, day);
    const endDate = new Date(startDate).setDate(startDate.getDate() + 1);

    try {
      const result = await this.homeTaskService.fetchHomeTaskDetail(
        homeId,
        startDate,
        endDate
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/:homeId/tasks/alert')
  async fetchHomeTaskAlerts(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string
  ) {
    try {
      const result = await this.homeTaskService.fetchHomeTaskAlerts(homeId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/:homeId/tasks/search')
  async searchHomeTasks(
    @Req() request,
    @Res() response,
    @Param() params,
    @Query() query
  ) {
    const { homeId } = params;
    const { keyword } = query;

    try {
      const result = await this.homeTaskService.searchHomeTasks(
        homeId,
        keyword
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/:homeId/tasks/statistics/:target')
  async fetchHomeTaskStatistics(
    @Req() request,
    @Res() response,
    @Param() params,
    @Query() query
  ) {
    const { homeId, target } = params;
    const { year, month } = query;

    const lastDay = new Date(year, month, 0).getDate();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month - 1, lastDay);

    try {
      const result = await this.homeTaskService.fetchHomeTaskStatistics(
        homeId,
        startDate,
        endDate,
        target
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Post('/:homeId/tasks')
  async createHomeTask(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string,
    @Body() createHomeTaskDto: CreateHomeTaskDto
  ) {
    const userId = request.userId;

    try {
      createHomeTaskDto.homeId = homeId;
      createHomeTaskDto.userId = userId;

      const result = await this.homeTaskService.create(createHomeTaskDto);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Delete('/tasks/:id')
  async deleteHomeTask(@Req() request, @Res() response, @Param() params) {
    const { id } = params;

    try {
      await this.homeTaskService.deleteOne(id);
      return response.status(HttpStatus.OK).json({});
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Patch('/:homeId/tasks')
  async updateHomeTask(
    @Req() request,
    @Res() response,
    @Body() updateHomeTaskDto: UpdateHomeTaskDto
  ) {
    const userId = request.userId;

    try {
      updateHomeTaskDto.userId = userId;
      await this.homeTaskService.patchHomeTask(updateHomeTaskDto);
      return response.status(HttpStatus.OK).json({});
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  // Refrigerator
  @Get('/:homeId/refrigerator/summary')
  async fetchRefrigeratorSummary(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string
  ) {
    try {
      const result = await this.refrigeratorFoodService.fetchSummary(homeId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Get('/:homeId/refrigerator/foods')
  async fetchFoods(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string
  ) {
    try {
      const result = await this.refrigeratorFoodService.fetchFoods(homeId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Post('/:homeId/refrigerator/foods')
  async addFood(
    @Req() request,
    @Res() response,
    @Param('homeId') homeId: string,
    @Body() createRefrigeratorFoodDto
  ) {
    const userId = request.userId;

    try {
      createRefrigeratorFoodDto.homeId = homeId;
      createRefrigeratorFoodDto.userId = userId;

      const result = await this.refrigeratorFoodService.addFood(
        createRefrigeratorFoodDto
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }
}
