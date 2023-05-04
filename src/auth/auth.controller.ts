import {
  Controller,
  Inject,
  Get,
  Redirect,
  Query,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { AuthService } from './auth.service';
import { PROVIDER } from 'src/constants/provider';
import { Request, Response } from 'express';
import { COOKIE, TOKEN } from 'src/constants/bearer';
import { ReissueGuard } from './auth.guard';

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
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (!!code || code.length === 0)
      // 이 로직을 없애는게 맞을 듯
      return this.kakaoService.failKakaoSignIn(error);
    try {
      const kakaoAccessToken = await this.kakaoService.getAccessTokenFromKakao(
        code,
      );

      const { url, accessToken, refreshToken } = await this.authService.signIn(
        kakaoAccessToken,
      );

      res.cookie(TOKEN.REFRESH_TOKEN, refreshToken, {
        maxAge: COOKIE.COOKIE_MAX_AGE,
        httpOnly: true,
      });
      return res.send({ url, accessToken });
    } catch (e) {
      return this.kakaoService.failKakaoSignIn(e);
    }
  }

  @Post('reissue-access')
  @UseGuards(ReissueGuard)
  reissueAccessToken(@Req() req: Request & { userId: string }) {
    return this.authService.reissueAccessToken(req.userId);
  }
}
