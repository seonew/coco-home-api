import { IsDate, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  avatarUrl: string;

  @IsString()
  loginType: string;

  @IsString()
  lastHomeId: string;

  @IsDate()
  registDate: Date;

  @IsDate()
  updateDate: Date;
}
