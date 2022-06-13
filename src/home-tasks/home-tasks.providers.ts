import { Mongoose } from 'mongoose';
import { HomeTaskSchema } from './schemas/home-task.schema';

export const homeTasksProviders = [
  {
    provide: 'HOME_TASK_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('HomeTask', HomeTaskSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
