import { Module } from '@nestjs/common';
import { KakaoModule } from './kakao/kakao.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [KakaoModule],
  controllers: [AuthController],
})
export class AuthModule {}
