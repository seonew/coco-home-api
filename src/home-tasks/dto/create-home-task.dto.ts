import { IsDate, IsString } from 'class-validator';

export class CreateHomeTaskDto {
  @IsString()
  homeId: string;

  @IsString()
  userId: string;

  @IsString()
  member: { name: string; id: string };

  @IsString()
  space: string;

  @IsString()
  targetItem: string;

  @IsString()
  work: string;

  @IsString()
  cycle: { value: number; unit: string };

  @IsDate()
  date: Date;

  @IsDate()
  registDate: Date;

  @IsDate()
  updateDate: Date;
}
