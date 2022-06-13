import { IsArray, IsDate, IsString } from 'class-validator';

export class UpdateHomeDto {
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
  updateDate: Date;
}
