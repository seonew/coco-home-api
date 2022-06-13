import * as mongoose from 'mongoose';

export const HomeSchema = new mongoose.Schema({
  id: String,
  userId: String,
  displayName: String,
  spaces: Array,
  items: Array,
  works: Array,
  registDate: { type: Date },
  updateDate: { type: Date },
});
