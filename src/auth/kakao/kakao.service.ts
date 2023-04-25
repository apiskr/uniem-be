import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResGetAuthCode } from 'src/api/kakaoAuth';
import { kakaoAuth } from 'src/api/kakaoAuth';
import { envNames } from 'src/constants/envNames';

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
    return await this.postKakaoToken(code);
  }

  private async postKakaoToken(code: string) {
    const res = await kakaoAuth.postKakaoToken(
      this.KAKAO_API_KEY,
      this.REDIRECT_URI,
      code,
    );
    return res.data;
  }

  // [Todo] error 출력 확인해보기 + 공통된 에러 처리 로직 필요
  public failKakaoSignIn(error: string) {
    return { error };
  }
}
