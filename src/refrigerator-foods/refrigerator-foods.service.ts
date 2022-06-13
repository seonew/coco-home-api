import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { CreateRefrigeratorFoodDto } from './dto/create-refrigerator-food.dto';
import { RefrigeratorFood } from './interfaces/refrigerator.interface';

@Injectable()
export class RefrigeratorFoodsService {
  constructor(
    @Inject('REFRIGERATOR_FOOD_MODEL')
    private readonly refrigeratorFoodModel: Model<RefrigeratorFood>,
    private readonly commonService: CommonService
  ) {}

  async fetchFoods(homeId: string): Promise<any> {
    try {
      const refrigeratorFoods = await this.refrigeratorFoodModel
        .find({
          homeId: homeId,
        })
        .sort({
          date: 1,
          priority: -1,
        });

      if (refrigeratorFoods.length === 0) {
        return {};
      }

      const resultArray = refrigeratorFoods.map((item) => {
        const currentItem = {
          id: item._id,
          targetItem: item.targetItem,
          space: item.space,
          count: item.count,
          priority: item.priority,
          expirationDay: item.expirationDay,
          date: moment(item.date).format('YYYY-MM-DD'),
        };

        if (item.date !== undefined) {
          const { expirationDay, ...nextItem } = currentItem;
          return nextItem;
        } else if (item.expirationDay !== undefined) {
          const { date, ...nextItem } = currentItem;
          const registDate = new Date(item.registDate);
          const convertRegistDate = new Date(
            Date.UTC(
              registDate.getFullYear(),
              registDate.getMonth(),
              registDate.getDate()
            )
          );
          const today = new Date();
          const convertToday = new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
          );
          const gap = convertToday.getTime() - convertRegistDate.getTime();
          const distance = Math.ceil(gap / (1000 * 60 * 60 * 24));

          const expirationDay = item.expirationDay;
          const distanceDay = expirationDay - distance;
          let nextExpirationDay = '';
          if (distanceDay >= 0) {
            nextExpirationDay = 'D-' + distanceDay;
          } else {
            nextExpirationDay = 'D+' + Math.abs(distanceDay);
          }

          return { ...nextItem, expirationDay: nextExpirationDay };
        }
      });

      return resultArray;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async addFood(
    createRefrigeratorFoodDto: CreateRefrigeratorFoodDto
  ): Promise<any> {
    try {
      createRefrigeratorFoodDto.registDate =
        this.commonService.getCurrentDate();
      const current = await this.create(createRefrigeratorFoodDto);
      return current;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchSummary(homeId: string): Promise<any> {
    try {
      const response = await this.refrigeratorFoodModel.aggregate([
        {
          $match: {
            homeId: homeId,
          },
        },
        {
          $group: {
            _id: '$space',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

      if (response.length === 0) {
        return [];
      }

      return response;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string): Promise<RefrigeratorFood> {
    try {
      const food = await this.findOneById(id);
      await food.updateOne({
        count: food.count - 1,
      });

      return food;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneById(id: string): Promise<RefrigeratorFood> {
    return await this.refrigeratorFoodModel.findById(id);
  }

  async create(createRefrigeratorFoodDto): Promise<RefrigeratorFood> {
    return this.refrigeratorFoodModel.create(createRefrigeratorFoodDto);
  }

  async deleteOne(id: string): Promise<any> {
    return await this.refrigeratorFoodModel.deleteOne({
      _id: id,
    });
  }
}
