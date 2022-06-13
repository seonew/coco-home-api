import { Document } from 'mongoose';

export interface RefrigeratorFood extends Document {
  homeId: string;
  targetItem: string;
  space: string;
  count: number;
  priority: number;
  date?: Date;
  expirationDay?: number;
  userId: string;
  registDate: Date;
}
