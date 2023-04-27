import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoService } from './kakao.service';

@Module({
  providers: [AuthService, { provide: 'KakaoService', useClass: KakaoService }],
})
export class AuthModule {}
