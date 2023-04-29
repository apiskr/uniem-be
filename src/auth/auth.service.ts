import { Injectable, Inject } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ResGetUserInfo } from 'src/api/kakaoApi';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { KakaoService } from './kakao.service';
import { PROVIDER } from 'src/constants/provider';

@Injectable()
export class AuthService {
  public constructor(
    @Inject(PROVIDER.KAKAO_SERVICE)
    private readonly kakaoService: KakaoService,
    @Inject(PROVIDER.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async signIn({ resUserInfo, accessToken }: PropsSignIn) {
    const resUniemUserInfo =
      await this.kakaoService.getUniemUserInfoByKakaoUserId(
        resUserInfo.data.id,
      );

    if (resUniemUserInfo === null) {
      await this.signUp({ resUserInfo, accessToken });
      console.log('회원가입 성공');
      return `${process.env.CLIENT_URL}/signup}`;
    } else {
      // [Todo] 토큰 발급 과정 추가 및 토큰 포함한 url 반환
      console.log('로그인 성공');
      return process.env.CLIENT_URL;
    }
  }

  private async signUp({ resUserInfo, accessToken }: PropsSignIn) {
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
      resUserInfo,
      userEntity: user,
      accessToken,
    });
  }

  // [Todo] 로그아웃
  // [Todo] 회원탈퇴
  // [Todo] 회원정보 수정
  // [Todo] 회원정보 조회
}

export type PropsSignIn = {
  resUserInfo: AxiosResponse<ResGetUserInfo, any>;
  accessToken: string;
};
