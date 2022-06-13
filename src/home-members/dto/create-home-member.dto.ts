import { IsDate, IsString } from 'class-validator';

export class CreateHomeMemberDto {
  @IsString()
  homeId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  imgUrl: string;

  @IsString()
  userId: string;

  @IsDate()
  registDate: Date;
}
