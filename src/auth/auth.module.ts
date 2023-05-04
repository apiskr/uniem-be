import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoService } from './kakao.service';
import { userProvider } from 'src/database/user.provider';
import { kakaoAccountProvider } from 'src/database/kakaoAccount.provider';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { PROVIDER } from 'src/constants/provider';
import { AuthGuard, ReissueGuard } from './auth.guard';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: PROVIDER.AUTH_SERVICE, useClass: AuthService },
    { provide: PROVIDER.KAKAO_SERVICE, useClass: KakaoService },
    { provide: PROVIDER.AUTH_GUARD, useClass: AuthGuard },
    { provide: PROVIDER.REISSUE_GUARD, useClass: ReissueGuard },
    ...userProvider,
    ...kakaoAccountProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
