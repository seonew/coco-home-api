import { Mongoose } from 'mongoose';
import { HomeMemberSchema } from './schemas/home-member.schema';

export const homeMembersProviders = [
  {
    provide: 'HOME_MEMBER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('HomeMember', HomeMemberSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
