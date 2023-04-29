import { DataSource } from 'typeorm';
import { KakaoAccountEntity } from '../user/kakao-account.entity';

export const kakaoAccountProvider = [
  {
    provide: 'KakaoAccountRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KakaoAccountEntity),
    inject: ['DATA_SOURCE'],
  },
];
