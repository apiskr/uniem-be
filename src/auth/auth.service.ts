import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ResGetUserInfo } from 'src/api/kakaoApi';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { KakaoService } from './kakao.service';
import { PROVIDER } from 'src/constants/provider';
import { JwtService } from '@nestjs/jwt';
import { TOKEN } from 'src/constants/bearer';

@Injectable()
export class AuthService {
  public constructor(
    @Inject(PROVIDER.KAKAO_SERVICE)
    private readonly kakaoService: KakaoService,
    @Inject(PROVIDER.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // [Todo] Exception 클래스 공부 + try catch 문으로 예외처리

  public async signIn(kakaoAccessToken: string) {
    const resKakaoUserInfo = await this.kakaoService.getUserInfo(
      kakaoAccessToken,
    );
    const resUserId = await this.kakaoService.getAppUserIdByKakaoUserId(
      resKakaoUserInfo.data.id,
    );

    if (resUserId === null)
      await this.signUp({ resKakaoUserInfo, kakaoAccessToken });

    const accessToken = this.jwtService.sign({
      sub: resUserId,
      expriresIn: TOKEN.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.sign(
      { sub: resUserId },
      { expiresIn: TOKEN.REFRESH_TOKEN_EXPIRES_IN },
    );

    await this.userRepository.update({ id: resUserId }, { refreshToken });
    return { url: process.env.CLIENT_URL, accessToken, refreshToken };
  }

  private async signUp({ resKakaoUserInfo, kakaoAccessToken }: PropsSignIn) {
    const user = this.userRepository.create({
      id: uuid(),
      major: null,
      grade: null,
      point: 0,
      fieldsOfConfidence: null,
      refreshToken: null,
      createdAt: new Date(),
    });
    await this.userRepository.save(user);

    await this.kakaoService.signUp({
      resKakaoUserInfo,
      userEntity: user,
      kakaoAccessToken,
    });
  }

  public async accessTokenValidation(accessToken: string) {
    try {
      const { sub } = this.jwtService.verify(accessToken);
      return sub;
    } catch (e) {
      return null;
    }
  }

  public reissueAccessToken(userId: string) {
    const newAccessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: TOKEN.ACCESS_TOKEN_EXPIRES_IN },
    );
    return { accessToken: newAccessToken };
  }

  // [Todo] 로그아웃 -> 리프레시 토큰 삭제해주고, 쿠키 삭제해주기

  // [Todo] 회원탈퇴
  // [Todo] 회원정보 수정
  // [Todo] 회원정보 조회
}

export type PropsSignIn = {
  resKakaoUserInfo: AxiosResponse<ResGetUserInfo, any>;
  kakaoAccessToken: string;
};
