import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';

export const userProvider = [
  {
    provide: 'UserRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];
