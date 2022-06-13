import { Mongoose } from 'mongoose';
import { HomeSchema } from './schemas/home.schema';

export const homesProviders = [
  {
    provide: 'HOME_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Home', HomeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
