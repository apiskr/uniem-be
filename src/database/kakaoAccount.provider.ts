import { DataSource } from 'typeorm';
import { KakaoAccountEntity } from '../user/kakao-account.entity';
import { PROVIDER } from 'src/constants/provider';

export const kakaoAccountProvider = [
  {
    provide: PROVIDER.KAKAO_ACCOUNT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(KakaoAccountEntity),
    inject: ['DATA_SOURCE'],
  },
];
