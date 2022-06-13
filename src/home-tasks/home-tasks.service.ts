import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { CreateHomeTaskDto } from './dto/create-home-task.dto';
import { UpdateHomeTaskDto } from './dto/update-home-task.dto';
import { HomeTask } from './interfaces/home-task.interface';

@Injectable()
export class HomeTasksService {
  constructor(
    @Inject('HOME_TASK_MODEL') private readonly homeTaskModel: Model<HomeTask>,
    private readonly commonService: CommonService
  ) {}

  async delete(homeId: string): Promise<void> {
    await this.homeTaskModel.deleteMany({
      homeId,
    });
  }

  async deleteOne(id: string): Promise<void> {
    await this.homeTaskModel.deleteOne({
      _id: id,
    });
  }

  async create(createHomeTaskDto: CreateHomeTaskDto): Promise<HomeTask> {
    try {
      createHomeTaskDto.registDate = this.commonService.getCurrentDate();
      const current = new this.homeTaskModel(createHomeTaskDto);
      return await current.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async patchHomeTask(updateHomeTaskDto: UpdateHomeTaskDto): Promise<any> {
    try {
      const current = await this.update(updateHomeTaskDto);
      return current;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(updateHomeTaskDto: UpdateHomeTaskDto) {
    return await this.homeTaskModel
      .findOne({
        _id: updateHomeTaskDto.id,
      })
      .updateOne({
        member: updateHomeTaskDto.member,
        space: updateHomeTaskDto.space,
        targetItem: updateHomeTaskDto.targetItem,
        work: updateHomeTaskDto.work,
        cycle: updateHomeTaskDto.cycle,
        date: updateHomeTaskDto.date,
        updateDate: this.commonService.getCurrentDate(),
      });
  }

  async findByKeyword(homeId, keyword): Promise<any> {
    return await this.homeTaskModel.find({
      homeId: homeId,
      targetItem: {
        $regex: keyword,
        $options: 'i',
      },
    });
  }

  async searchHomeTasks(homeId, keyword): Promise<any> {
    try {
      const response = await this.findByKeyword(homeId, keyword);
      if (response.length === 0) {
        return [];
      }

      const array = response.map((item) => ({
        id: item._id,
        member: item.member,
        space: item.space,
        targetItem: item.targetItem,
        work: item.work,
        date: moment(item.date).format('YYYY-MM-DD'),
        cycle: item.cycle,
      }));

      return array;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchHomeTaskStatistics(
    homeId,
    startDate,
    endDate,
    target
  ): Promise<any> {
    try {
      const key = '$' + target;
      const response = await this.aggregate(homeId, startDate, endDate, key);

      const result = { key: [], count: [] };
      if (!response) {
        return result;
      }

      response.forEach((item) => {
        let _id = item._id;
        if (target === 'member') {
          _id = item._id.name;
        }

        if (_id !== null) {
          result.key.push(_id);
          result.count.push(item.count);
        }
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async aggregate(homeId: string, startDate, endDate, key): Promise<any> {
    return await this.homeTaskModel.aggregate([
      {
        $match: {
          homeId: homeId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: key,
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  }

  async fetchHomeTasks(homeId: string, year, month): Promise<any> {
    const lastDay = new Date(year, month, 0).getDate();
    const startDate = moment(new Date(year, month - 1, 1));
    const endDate = moment(new Date(year, month - 1, lastDay, 23, 59, 59));

    try {
      const tasks: HomeTask[] = await this.findByDate(
        homeId,
        startDate,
        endDate
      );
      if (tasks.length === 0) {
        return [];
      }

      const storedList = tasks;
      const map = {};
      let array = [];
      let registDate = new Date(storedList[0].date).getDate();

      for (let i = 1; i < lastDay + 1; i++) {
        if (i === registDate) {
          for (let j = 0; j < storedList.length; j++) {
            const current = storedList[j];
            const currentDate = new Date(current.date).getDate();

            if (registDate === currentDate) {
              const currentObject = {
                id: current._id,
                member: current.member,
                space: current.space,
                targetItem: current.targetItem,
                work: current.work,
                date: moment(current.date).format('YYYY-MM-DD'),
                cycle: current.cycle,
                registDate: moment(current._id.getTimestamp()).format(
                  'YYYY-MM-DD HH:mmA'
                ),
              };

              array.push(currentObject);
            } else if (registDate < currentDate) {
              registDate = currentDate;
              break;
            } else {
            }
          }
        }
        map[i] = array;
        array = [];
      }

      return map;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchHomeTaskDetail(homeId: string, startDate, endDate): Promise<any> {
    try {
      const tasks = await this.findByDate(homeId, startDate, endDate);
      if (tasks.length === 0) {
        return [];
      }

      const array = [];
      let currentObject = {};

      tasks.forEach((current, index) => {
        currentObject = {
          id: current._id,
          member: current.member,
          space: current.space,
          targetItem: current.targetItem,
          work: current.work,
          date: moment(current.date).format('YYYY-MM-DD'),
          cycle: current.cycle,
        };

        array[index] = currentObject;
        currentObject = {};
      });

      return array;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchHomeTaskAlerts(homeId: string): Promise<any> {
    const today = new Date(moment().format('YYYY-MM-DD'));

    try {
      const response = await this.homeTaskModel.find({
        homeId: homeId,
        'cycle.value': {
          $gt: 0,
        },
        'cycle.unit': {
          $ne: '',
        },
      });

      const result = [];
      response.forEach((item) => {
        const nextDate = new Date(moment(item.date).format('YYYY-MM-DD'));
        let nextDay = 0;
        const currentDate = item.date;
        const currentUnit = item.cycle.unit;
        const currentNumber = item.cycle.value;

        if (currentUnit === '0') {
          nextDay = currentNumber * 1;
        } else if (currentUnit === '1') {
          nextDay = currentNumber * 7;
        } else if (currentUnit === '2') {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;
          const lastDay = new Date(year, month, 0).getDate();

          nextDay = currentNumber * lastDay;
        }

        nextDate.setDate(nextDate.getDate() + nextDay);

        const distance = nextDate.getTime() - today.getTime();
        const day = Math.floor(distance / (1000 * 60 * 60 * 24));

        if (day >= 0 && day <= 7) {
          const next = {
            id: item._id,
            member: item.member,
            space: item.space,
            targetItem: item.targetItem,
            work: item.work,
            date: moment(item.date).format('YYYY-MM-DD'),
            cycle: item.cycle,
            dday: day,
          };

          result.push(next);
        }
      });

      result.sort((a, b) => {
        return a.dday - b.dday;
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByDate(homeId: string, startDate, endDate): Promise<HomeTask[]> {
    return await this.homeTaskModel
      .find({
        homeId: homeId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({
        date: 1,
      });
  }
}
