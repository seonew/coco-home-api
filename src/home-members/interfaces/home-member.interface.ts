import { Document } from 'mongoose';

export interface HomeMember extends Document {
  homeId: string;
  name: string;
  type: string;
  imgUrl: string;
  userId: string;
  registDate: Date;
}
