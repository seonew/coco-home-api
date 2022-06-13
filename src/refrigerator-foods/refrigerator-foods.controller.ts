import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/common/filters/common.error.filter';
import { AuthGuard } from 'src/common/guards/common.auth.guard';
import { UsersService } from 'src/users/users.service';
import { RefrigeratorFoodsService } from './refrigerator-foods.service';

@Controller('refrigerator')
@UseGuards(AuthGuard)
@UseFilters(AllExceptionsFilter)
export class RefrigeratorFoodsController {
  constructor(
    private readonly refrigeratorFoodService: RefrigeratorFoodsService,
    private readonly userService: UsersService
  ) {}

  @Patch('/foods/:id/consume')
  async updateFood(@Req() request, @Res() response, @Param('id') id: string) {
    try {
      const result = await this.refrigeratorFoodService.update(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Delete('/foods/:id')
  async deleteFood(@Req() request, @Res() response, @Param('id') id: string) {
    try {
      const result = await this.refrigeratorFoodService.deleteOne(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }
}
