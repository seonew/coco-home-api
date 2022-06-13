import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateRefrigeratorFoodDto {
  @IsString()
  homeId: string;

  @IsString()
  targetItem: string;

  @IsString()
  space: string;

  @IsNumber()
  count: number;

  @IsNumber()
  priority: number;

  @IsDate()
  date: Date;

  @IsNumber()
  expirationDay: number;

  @IsString()
  userId: string;

  @IsDate()
  registDate: Date;
}
