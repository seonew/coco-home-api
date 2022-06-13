import { IsDate, IsString } from 'class-validator';

export class UpdateHomeTaskDto {
  @IsString()
  id: string;

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

  @IsString()
  userId: string;

  @IsDate()
  updateDate: Date;
}
