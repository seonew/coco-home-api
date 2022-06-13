import * as mongoose from 'mongoose';

export const HomeMemberSchema = new mongoose.Schema({
  homeId: String,
  name: String,
  type: String,
  imgUrl: String,
  userId: String,
  registDate: { type: Date },
});
