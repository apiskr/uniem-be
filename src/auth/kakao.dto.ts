import { ResPostKakaoToken } from 'src/api/kakaoAuth';

export class KakaoTokenDto {
  constructor(private readonly data: ResPostKakaoToken) {
    this.data = data;
  }

  public get getAccessToken(): string {
    return this.data.access_token;
  }

  public get getRefreshToken(): string {
    return this.data.refresh_token;
  }

  public get getIdToken(): string {
    return this.data.id_token;
  }

  public get getExpiresIn(): number {
    return this.data.expires_in;
  }

  public get getRefreshTokenExpiresIn(): number {
    return this.data.refresh_token_expires_in;
  }

  public get getScope(): string {
    return this.data.scope;
  }
}
