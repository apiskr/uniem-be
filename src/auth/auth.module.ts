import { Module } from '@nestjs/common';
import { KakaoModule } from './kakao/kakao.module';

@Module({
  imports: [KakaoModule],
})
export class AuthModule {}
