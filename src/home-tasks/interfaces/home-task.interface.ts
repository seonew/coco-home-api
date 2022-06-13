import { Document } from 'mongoose';

export interface HomeTask extends Document {
  homeId: string;
  userId: string;
  member: { name: string; id: string };
  space: string;
  targetItem: string;
  work: string;
  date: Date;
  cycle: { value: number; unit: string };
  registDate: Date;
}
