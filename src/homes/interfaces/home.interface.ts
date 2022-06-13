import { Document } from 'mongoose';

export interface Home extends Document {
  id: string;
  userId: string;
  displayName: string;
  spaces: [];
  items: [];
  works: [];
  registDate: Date;
  updateDate: Date;
}
