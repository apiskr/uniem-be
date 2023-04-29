import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoService } from './kakao.service';
import { userProvider } from 'src/database/user.provider';
import { kakaoAccountProvider } from 'src/database/kakaoAccount.provider';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: 'AuthService', useClass: AuthService },
    { provide: 'KakaoService', useClass: KakaoService },
    ...userProvider,
    ...kakaoAccountProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
