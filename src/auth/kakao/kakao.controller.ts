import { Controller } from '@nestjs/common';
import { Inject, Get, Redirect, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller('kakao')
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

  @Get(`/redirect`)
  getTokenFromKakao(
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    if (code.length !== 0) return this.kakaoService.getTokenFromKakao(code);
    else return this.kakaoService.failKakaoSignIn(error);
  }
}
