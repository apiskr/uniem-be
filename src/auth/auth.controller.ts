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
  Delete,
} from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { AuthService } from './auth.service';
import { PROVIDER } from 'src/constants/provider';
import { Request, Response } from 'express';
import { COOKIE, TOKEN } from 'src/constants/bearer';
import { ReissueGuard } from './auth.guard';
import { UserGuard } from 'src/user/user.guard';
import { AxiosError } from 'axios';

const KAKAO = 'kakao';
// [Todo] 개인 정보 만료 및 삭제 구현
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
    @Query('error') error: AxiosError,
    @Res() res: Response,
  ) {
    if (!code || code.length === 0)
      return this.kakaoService.failKakaoSignIn(error);
    try {
      const kakaoAccessToken = await this.kakaoService.getAccessTokenFromKakao(
        code,
      );

      const resKakaoUserInfo = await this.kakaoService.getUserInfo(
        kakaoAccessToken,
      );

      const { url, accessToken, refreshToken } = await this.authService.signIn({
        ...resKakaoUserInfo,
      });

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
  reissueAccessToken(@Req() req: RequestWithUserId) {
    return this.authService.reissueAccessToken(req.userId);
  }

  @Post('sign-out')
  @UseGuards(UserGuard)
  async signOut(@Req() req: RequestWithUserId, @Res() res: Response) {
    // [Temp] 카카오 로그아웃을 해주지 않는 중
    res.clearCookie(TOKEN.REFRESH_TOKEN);
    await this.authService.signOut(req.userId);

    return res.send({ id: req.userId });
  }

  @Delete()
  @UseGuards(UserGuard)
  async deleteUser(@Req() req: RequestWithUserId, @Res() res: Response) {
    // [Temp] 카카오 로그아웃을 해주지 않는 중
    try {
      res.clearCookie(TOKEN.REFRESH_TOKEN);
      await this.authService.deleteUser(req.userId);
      return res.send({ userId: req.userId });
    } catch (e) {
      return res.send(e);
    }
  }
}

type RequestWithUserId = Request & { userId: string };
