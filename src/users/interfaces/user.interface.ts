import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  name: string;
  avatarUrl: string;
  loginType: string;
  lastHomeId: string;
  registDate: Date;
  updateDate: Date;
}
