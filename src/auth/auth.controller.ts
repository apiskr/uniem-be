import { Controller, Inject, Get, Redirect, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { AuthService } from './auth.service';

const KAKAO = 'kakao';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('KakaoService')
    private readonly kakaoService: KakaoService,
    @Inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  @Get(`${KAKAO}/`)
  @Redirect()
  openKakaoSignIn() {
    return this.kakaoService.openKakaoSignIn();
  }

  @Get(`${KAKAO}/redirect`)
  @Redirect()
  async getTokenFromKakao(
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    if (code.length === 0) return this.kakaoService.failKakaoSignIn(error);
    try {
      const kakaoToken = await this.kakaoService.getTokenFromKakao(code);
      const resUserInfo = await this.kakaoService.getUserInfo(
        kakaoToken.getAccessToken,
      );
      // 이 로직 자체를 서비스로 넣어야 할 듯
      return this.authService.signIn({
        resUserInfo,
        accessToken: kakaoToken.getAccessToken,
      });
    } catch (e) {
      return this.kakaoService.failKakaoSignIn(e);
    }
  }
}
