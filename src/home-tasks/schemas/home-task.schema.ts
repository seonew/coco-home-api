import * as mongoose from 'mongoose';

export const HomeTaskSchema = new mongoose.Schema({
  homeId: String,
  userId: String,
  member: { name: String, id: String },
  space: String,
  targetItem: String,
  work: String,
  date: { type: Date },
  cycle: Object,
  registDate: { type: Date },
});
