import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async loginGithub(@Res() response, @Body() body) {
    const { code } = body;
    if (code === undefined || code === null) {
      throw new UnauthorizedException();
    }

    try {
      const result = await this.authService.loginGithub(code);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Post('/kakao')
  async loginKakao(@Res() response, @Body() body) {
    const { code } = body;
    if (code === undefined || code === null) {
      throw new UnauthorizedException();
    }

    try {
      const result = await this.authService.loginKakao(code);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }

  @Post('/guest')
  async loginGuest(@Res() response, @Body() body) {
    const { code } = body;
    try {
      const result = await this.authService.loginGuest();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      response.status(error.status).json();
    }
  }
}
