import { IsArray, IsDate, IsString } from 'class-validator';

export class CreateHomeDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  displayName: string;

  @IsArray()
  members: [];

  @IsArray()
  spaces: [];

  @IsArray()
  items: [];

  @IsArray()
  works: [];

  @IsDate()
  registDate: Date;

  @IsDate()
  updateDate: Date;
}
