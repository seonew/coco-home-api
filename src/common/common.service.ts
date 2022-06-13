import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

@Injectable()
export class CommonService {
  constructor(private readonly jwtService: JwtService) {}

  getCurrentDate() {
    return new Date(moment().format());
  }

  async verifyToken(token): Promise<any> {
    return await this.jwtService.verify(token);
  }

  async signData(data): Promise<any> {
    return await this.jwtService.sign({
      login: data.login,
      id: data.id,
    });
  }

  getCodeToCreateForGuest(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getCodeToUserNameForGuest() {
    const characters = ['개나리', '매화', '목련', '진달래', '철쭉'];
    let result = characters[Math.floor(Math.random() * characters.length)];

    for (let i = 0; i < 3; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
}
