import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { User } from './interfaces/user.interface';
import { HomesService } from 'src/homes/homes.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    private readonly homeService: HomesService,
    private readonly commonService: CommonService
  ) {}

  async updateUser(homeId: string, userId: string): Promise<string> {
    try {
      await this.updateOneByHomeId(homeId, userId);
      await this.homeService.updateByDate(homeId);

      return homeId;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateOneByHomeId(homeId: string, userId: string): Promise<any> {
    const user = await this.findOne(userId);
    return await user.updateOne({
      lastHomeId: homeId,
      updateDate: this.commonService.getCurrentDate(),
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ id });
  }

  async findAllName(name: string): Promise<User[]> {
    return await this.userModel.find({ name });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }
}
