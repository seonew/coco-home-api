import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

import { UsersService } from 'src/users/users.service';
import { CommonService } from 'src/common/common.service';
import { stringify } from 'querystring';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly commonService: CommonService
  ) {}

  async loginGithub(code: string): Promise<any> {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          code,
          client_id,
          client_secret,
        },
        {
          headers: {
            accept: 'application/json',
          },
        }
      );

      const token = await response.data.access_token;
      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      let lastHomeId = '';
      let imgUrl = '';
      let userId = '';
      const user = await this.userService.findOne(data.id.toString());

      if (user === null) {
        imgUrl = data.avatar_url;
        userId = data.id;

        const createUserDto: CreateUserDto = {
          id: data.id,
          name: data.login,
          avatarUrl: data.avatar_url,
          loginType: 'github',
          lastHomeId: '',
          registDate: this.commonService.getCurrentDate(),
          updateDate: this.commonService.getCurrentDate(),
        };

        await this.userService.create(createUserDto);
      } else {
        imgUrl = user.avatarUrl;
        userId = user.id;
        lastHomeId = user.lastHomeId;

        await user.updateOne({
          name: user.name,
          avatarUrl: imgUrl,
          updateDate: this.commonService.getCurrentDate(),
        });
      }

      const access_token = await this.commonService.signData(data);
      return { access_token, name: data.login, lastHomeId, imgUrl, userId };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async loginKakao(code: string): Promise<any> {
    const client_id = process.env.CLIENT_KAKAO_ID;
    const client_secret = process.env.CLIENT_KAKAO_SECRET;
    const grant_type = 'authorization_code';
    const redirect_uri = process.env.CLIENT_KAKAO_REDIRECT_URI;

    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        stringify({
          grant_type,
          client_id,
          redirect_uri,
          code,
          client_secret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const token = response.data.access_token;
      const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let lastHomeId = '';
      let imgUrl = '';
      let userId = '';
      const user = await this.userService.findOne(data.id.toString());
      const userName = data.kakao_account.profile.nickname;

      if (user === null) {
        imgUrl = data.kakao_account.profile.thumbnail_image_url;
        userId = data.id;

        const createUserDto: CreateUserDto = {
          id: userId,
          name: userName,
          avatarUrl: imgUrl,
          loginType: 'kakao',
          lastHomeId: '',
          registDate: this.commonService.getCurrentDate(),
          updateDate: this.commonService.getCurrentDate(),
        };

        await this.userService.create(createUserDto);
      } else {
        imgUrl = user.avatarUrl;
        userId = user.id;
        lastHomeId = user.lastHomeId;

        await user.updateOne({
          name: user.name,
          avatarUrl: user.avatarUrl,
          updateDate: this.commonService.getCurrentDate(),
        });
      }

      const access_token = await this.commonService.signData(data);
      return { access_token, name: userName, lastHomeId, imgUrl, userId };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async loginGuest(): Promise<any> {
    try {
      const code = this.commonService.getCodeToCreateForGuest(10);
      const userName = this.commonService.getCodeToUserNameForGuest();
      const userId = code;
      const imgUrl = '';
      const lastHomeId = '';

      const createUserDto: CreateUserDto = {
        id: userId,
        name: userName,
        avatarUrl: imgUrl,
        loginType: 'guest',
        lastHomeId: '',
        registDate: this.commonService.getCurrentDate(),
        updateDate: this.commonService.getCurrentDate(),
      };

      await this.userService.create(createUserDto);

      const data = { login: 'login', id: code };
      const access_token = await this.commonService.signData(data);
      return { access_token, name: userName, lastHomeId, imgUrl, userId };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
