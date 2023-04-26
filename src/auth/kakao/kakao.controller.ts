import { Controller } from '@nestjs/common';
import { Inject, Get, Redirect, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller('auth/kakao')
export class KakaoController {
  constructor(
    @Inject('KakaoService')
    private readonly kakaoService: KakaoService,
  ) {}

  @Get('/')
  @Redirect()
  openKakaoSignIn() {
    return this.kakaoService.openKakaoSignIn();
  }

  // ?
  @Get(`/redirect`)
  async getTokenFromKakao(
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    if (code.length === 0) return this.kakaoService.failKakaoSignIn(error);

    const kakaoToken = await this.kakaoService.getTokenFromKakao(code);
    const res = await this.kakaoService.getUserInfo(kakaoToken.getAccessToken);
    console.log(res.data);
    return {
      accessToken: kakaoToken.getAccessToken,
      refreshToken: kakaoToken.getRefreshToken,
    };
  }
}
