import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { CreateHomeMemberDto } from './dto/create-home-member.dto';
import { HomeMember } from './interfaces/home-member.interface';

@Injectable()
export class HomeMembersService {
  constructor(
    @Inject('HOME_MEMBER_MODEL')
    private readonly homeMemberModel: Model<HomeMember>,
    private readonly commonService: CommonService
  ) {}

  async fetchHomeMembers(userId: string, addUsers): Promise<HomeMember[]> {
    try {
      const result = [];
      addUsers.map((current) => {
        let type = 'member';
        if (current.id === userId.toString()) {
          type = 'owner';
        }

        const item = {
          userId: current.id,
          name: current.name,
          imgUrl: current.avatarUrl,
          type: type,
        };

        result.push(item);
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async add(homeId, memberList): Promise<void> {
    const previousMemberList = await this.findAllByHomeId(homeId);
    const previous = previousMemberList.map((item) => {
      return item.userId;
    });

    const next = memberList.map((item) => {
      return item.userId;
    });

    const addList = next.filter((item) => {
      if (!previous.includes(item)) {
        return item;
      }
    });
    const removeList = previous.filter((item) => {
      if (!next.includes(item)) {
        return item;
      }
    });

    if (addList.length > 0) {
      const addMemberList = memberList.filter((item) => {
        if (addList.includes(item.userId)) {
          return item;
        }
      });

      addMemberList.forEach(async (createHomeMemberDto) => {
        createHomeMemberDto.homeId = homeId;
        createHomeMemberDto.registDate = this.commonService.getCurrentDate();
        await this.create(createHomeMemberDto);
      });
    }

    if (removeList.length > 0) {
      removeList.forEach(async (userId) => {
        await this.deleteOne(homeId, userId);
      });
    }
  }

  async findAllByUserId(userId: string): Promise<HomeMember[]> {
    return await this.homeMemberModel.find({ userId }).exec();
  }

  async findById(id: string): Promise<HomeMember> {
    return await this.homeMemberModel.findById(id).exec();
  }

  async findAllByHomeId(homeId: string): Promise<HomeMember[]> {
    return await this.homeMemberModel
      .find({ homeId })
      .sort({
        type: -1,
      })
      .exec();
  }

  async create(createHomeMemberDto: CreateHomeMemberDto): Promise<HomeMember> {
    const current = new this.homeMemberModel(createHomeMemberDto);
    return await current.save();
  }

  async deleteOne(homeId, userId): Promise<void> {
    await this.homeMemberModel.deleteOne({
      userId: userId,
      homeId: homeId,
    });
  }

  async delete(homeId): Promise<void> {
    await this.homeMemberModel.deleteMany({ homeId });
  }
}
