import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResGetAuthCode } from 'src/api/kakaoAuth';
import { kakaoAuth } from 'src/api/kakaoAuth';
import { envNames } from 'src/constants/envNames';
import { KakaoTokenDto } from '../kakao.dto';
import { kakaoApi } from 'src/api/kakaoApi';

@Injectable()
export class KakaoService {
  private KAKAO_API_KEY: string;
  private REDIRECT_URI: string;

  public constructor(private readonly configService: ConfigService) {
    this.KAKAO_API_KEY = this.configService.get<string>(
      envNames.KAKAO_REST_API_KEY,
    );
    this.REDIRECT_URI = this.configService.get<string>(envNames.REDIRECT_URI);
  }

  public openKakaoSignIn(): ResGetAuthCode {
    return kakaoAuth.getAuthCode(this.KAKAO_API_KEY, this.REDIRECT_URI);
  }

  public async getTokenFromKakao(code: string) {
    const res = await this.postKakaoToken(code);
    return new KakaoTokenDto(res.data); // [Temp] Dto 이렇게 사용하면 되나?
  }

  private async postKakaoToken(code: string) {
    const res = await kakaoAuth.postKakaoToken(
      this.KAKAO_API_KEY,
      this.REDIRECT_URI,
      code,
    );
    return res;
  }

  // [Todo] error 출력 확인해보기 + 공통된 에러 처리 로직 필요
  public failKakaoSignIn(error: string) {
    return { error };
  }

  public async getUserInfo(accessToken: string) {
    return await kakaoApi.getUserInfo(accessToken);
  }
}
