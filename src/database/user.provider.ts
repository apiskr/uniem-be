import { DataSource } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PROVIDER } from 'src/constants/provider';

export const userProvider = [
  {
    provide: PROVIDER.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [PROVIDER.DATABASE_PROVIDER],
  },
];
