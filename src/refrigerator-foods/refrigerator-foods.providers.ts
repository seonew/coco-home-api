import { Mongoose } from 'mongoose';
import { RefrigeratorFoodSchema } from './schemas/refrigerator.schema';

export const refrigeratorFoodsProviders = [
  {
    provide: 'REFRIGERATOR_FOOD_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('refrigeratorFood', RefrigeratorFoodSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
