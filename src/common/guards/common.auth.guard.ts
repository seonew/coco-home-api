import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers['x-auth-token'];

      if (token === 'undefined' || token === null) {
        throw new UnauthorizedException();
      }

      const decodeData = await this.commonService.verifyToken(token);
      const userId = decodeData.id;
      request.userId = userId;

      const user = await this.userService.findOne(userId);
      if (user === null) {
        throw new UnauthorizedException();
      }

      return userId;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
