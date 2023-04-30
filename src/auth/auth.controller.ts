import { Controller, Inject, Get, Redirect, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { AuthService } from './auth.service';
import { PROVIDER } from 'src/constants/provider';

const KAKAO = 'kakao';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(PROVIDER.KAKAO_SERVICE)
    private readonly kakaoService: KakaoService,
    @Inject(PROVIDER.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @Get(`${KAKAO}/`)
  @Redirect()
  openKakaoSignIn() {
    return this.kakaoService.openKakaoSignIn();
  }

  @Get(`${KAKAO}/redirect`)
  async signInByKakao(
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    if (code.length === 0) return this.kakaoService.failKakaoSignIn(error);
    try {
      const kakaoAccessToken = await this.kakaoService.getAccessTokenFromKakao(
        code,
      );
      return await this.authService.signIn(kakaoAccessToken);
    } catch (e) {
      return this.kakaoService.failKakaoSignIn(e);
    }
  }
}
