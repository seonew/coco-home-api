import * as mongoose from 'mongoose';

export const RefrigeratorFoodSchema = new mongoose.Schema({
  homeId: String,
  targetItem: String,
  space: String,
  count: Number,
  priority: Number,
  date: Date,
  expirationDay: Number,
  userId: String,
  registDate: { type: Date },
});
