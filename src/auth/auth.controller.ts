import { Controller, Inject, Get, Redirect, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';

const KAKAO = 'kakao';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('KakaoService')
    private readonly kakaoService: KakaoService,
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

    const kakaoToken = await this.kakaoService.getTokenFromKakao(code);
    // [Temp] 한 번 요청을 저장하면 좋을까?
    const resUserInfo = await this.kakaoService.getUserInfo(
      kakaoToken.getAccessToken,
    );
    const kakaoUserId = resUserInfo.data.id;
    const resUniemUserInfo =
      await this.kakaoService.getUniemUserInfoByKakaoUserId(kakaoUserId);

    if (resUniemUserInfo === null) {
      // [Todo] 회원가입 redirect
    } else {
      // [Todo] 로그인 redirect
    }
  }
}
