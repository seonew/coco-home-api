import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  avatarUrl: String,
  loginType: String,
  lastHomeId: String,
  registDate: { type: Date },
  updateDate: { type: Date },
});
