import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { Home } from './interfaces/home.interface';
import { HomeMembersService } from 'src/home-members/home-members.service';
import { HomeTasksService } from 'src/home-tasks/home-tasks.service';
import { CommonService } from 'src/common/common.service';
import { HomeMember } from 'src/home-members/interfaces/home-member.interface';
import { UpdateHomeDto } from './dto/update-home.dto';
import { CreateHomeDto } from './dto/create-home.dto';

@Injectable()
export class HomesService {
  constructor(
    @Inject('HOME_MODEL') private readonly homeModel: Model<Home>,
    private readonly homeMemberService: HomeMembersService,
    private readonly homeTaskService: HomeTasksService,
    private readonly commonService: CommonService
  ) {}

  async fetchHomeInfo(homeId: string): Promise<any> {
    try {
      const map = {
        id: '',
        displayName: '',
        members: [],
        spaces: [],
        items: [],
        works: [],
      };

      const homeResponse = await this.findById(homeId);
      if (!homeResponse) {
        return map;
      }

      const memberResponse: HomeMember[] =
        await this.homeMemberService.findAllByHomeId(homeId);
      const members = memberResponse.map((item) => ({
        name: item.name,
        type: item.type,
        imgUrl: item.imgUrl,
        userId: item.userId,
      }));

      const item = homeResponse;
      map.id = item.id;
      map.displayName = item.displayName;
      map.members = members;
      map.spaces = item.spaces;
      map.items = item.items;
      map.works = item.works;

      return map;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchHomes(userId: string): Promise<any> {
    try {
      const homesByUserId = await this.homeMemberService.findAllByUserId(
        userId
      );
      const homeIds = homesByUserId.map((item) => {
        return item.homeId;
      });
      const homeMembers = homesByUserId.map((item) => ({
        homeId: item.homeId,
        name: item.name,
        type: item.type,
      }));

      const homes = await this.findByHomeIds(homeIds);
      if (homes.length === 0) {
        return [];
      }

      const result = homes.map((item) => {
        const foundMember = homeMembers.find(
          (member) => member.homeId === item.id.toString()
        );

        return {
          homeId: item.id,
          displayName: item.displayName,
          memberType: foundMember ? foundMember.type : '',
        };
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async addHome(createHomeDto): Promise<Home> {
    try {
      createHomeDto.id = new Types.ObjectId();
      createHomeDto.registDate = this.commonService.getCurrentDate();
      createHomeDto.updateDate = this.commonService.getCurrentDate();
      const current = await this.create(createHomeDto);
      await this.homeMemberService.add(current.id, createHomeDto.members);
      return current;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async patchHome(updateHomeDto: UpdateHomeDto): Promise<void> {
    try {
      await this.updateHome(updateHomeDto);
      await this.homeMemberService.add(updateHomeDto.id, updateHomeDto.members);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByHomeIds(homeIds: Array<string>) {
    return await this.homeModel
      .find({
        id: { $in: homeIds },
      })
      .sort({
        updateDate: -1,
      });
  }

  async findById(id: string): Promise<Home> {
    return await this.homeModel.findOne({ id: id }).exec();
  }

  async findByUserId(userId: string): Promise<Home> {
    return await this.homeModel
      .findOne({
        userId: userId,
      })
      .sort({
        registDate: -1,
      });
  }

  async deleteHome(id: string): Promise<any> {
    const home = await this.findById(id);
    const homeId = home.id;

    await this.deleteOne(id);
    await this.homeMemberService.delete(homeId);
    await this.homeTaskService.delete(homeId);
  }

  async deleteOne(id: string): Promise<void> {
    await this.homeModel.deleteOne({
      id: id,
    });
  }

  async updateHome(updateHomeDto) {
    return await this.homeModel
      .findOne({
        id: updateHomeDto.id,
      })
      .updateOne({
        displayName: updateHomeDto.displayName,
        spaces: updateHomeDto.spaces,
        items: updateHomeDto.items,
        works: updateHomeDto.works,
        updateDate: this.commonService.getCurrentDate(),
      });
  }

  async updateByDate(homeId): Promise<any> {
    return await this.homeModel
      .findOne({
        id: homeId,
      })
      .updateOne({
        updateDate: this.commonService.getCurrentDate(),
      });
  }

  async update(id: string, home: Home): Promise<Home> {
    return await this.homeModel.findByIdAndUpdate(id, home);
  }

  async create(createHomeDto: CreateHomeDto): Promise<Home> {
    const current = new this.homeModel(createHomeDto);
    return await current.save();
  }
}
