import { DataSource } from 'typeorm';
import { KakaoAccountEntity } from '../user/kakao-account/kakao-account.entity';

export const kakaoAccountProvider = [
  {
    provide: 'KakaoRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KakaoAccountEntity),
    inject: ['DATA_SOURCE'],
  },
];
