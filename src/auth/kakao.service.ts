import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ResGetAuthCode } from 'src/api/kakaoAuth';
import { kakaoAuth } from 'src/api/kakaoAuth';
import { KakaoTokenDto } from './kakao.dto';
import { kakaoApi } from 'src/api/kakaoApi';
import { ResGetUserInfo } from 'src/api/kakaoApi';
import { ADDED_KAKAO_PLUS_FLRIEND } from 'src/constants/entity';
import { AxiosError } from 'axios';

@Injectable()
export class KakaoService {
  private KAKAO_API_KEY: string;
  private REDIRECT_URI: string;

  public constructor() {
    this.KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY;
    this.REDIRECT_URI = process.env.REDIRECT_URI;
  }

  public openKakaoSignIn(): ResGetAuthCode {
    return kakaoAuth.getAuthCode(this.KAKAO_API_KEY, this.REDIRECT_URI);
  }

  public async getAccessTokenFromKakao(code: string) {
    const res = await this.postKakaoToken(code);
    return new KakaoTokenDto(res.data).getAccessToken; // [Todo] Dto 굳이 쓰는 느낌
  }

  private async postKakaoToken(code: string) {
    const res = await kakaoAuth.postKakaoToken(
      this.KAKAO_API_KEY,
      this.REDIRECT_URI,
      code,
    );
    return res;
  }

  // [Todo] 이게 맞을까
  public failKakaoSignIn(error: AxiosError) {
    throw new UnauthorizedException({
      message: error.message,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  public async getUserInfo(accessToken: string): Promise<UserInfo> {
    const resGetUserInfo = await kakaoApi.getUserInfo(accessToken);
    const resGetUserKakaoChanelList = await kakaoApi.getUserKakaoChanelList(
      accessToken,
    );
    return {
      ...resGetUserInfo.data,
      addedKakaoPlusfriend: resGetUserKakaoChanelList.data.channels[0].relation,
    };
  }
}

export type UserInfo = ResGetUserInfo & {
  addedKakaoPlusfriend: ADDED_KAKAO_PLUS_FLRIEND;
};
