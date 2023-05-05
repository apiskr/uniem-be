import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { ResGetAuthCode } from 'src/api/kakaoAuth';
import { kakaoAuth } from 'src/api/kakaoAuth';
import { KakaoTokenDto } from './kakao.dto';
import { kakaoApi } from 'src/api/kakaoApi';
import { Repository } from 'typeorm';
import { KakaoAccountEntity } from 'src/user/kakao-account.entity';
import { UserEntity } from 'src/user/user.entity';
import { PropsSignIn } from './auth.service';
import { PROVIDER } from 'src/constants/provider';

@Injectable()
export class KakaoService {
  private KAKAO_API_KEY: string;
  private REDIRECT_URI: string;

  public constructor(
    @Inject(PROVIDER.KAKAO_ACCOUNT_REPOSITORY)
    private readonly kakaoAccountRepository: Repository<KakaoAccountEntity>,
  ) {
    this.KAKAO_API_KEY = process.env.KAKAO_API_KEY;
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

  public failKakaoSignIn(error: string) {
    throw new UnauthorizedException(error);
  }

  public async getUserInfo(accessToken: string) {
    return await kakaoApi.getUserInfo(accessToken);
  }

  public async getAppUserIdByKakaoUserId(kakaoUserId: string) {
    const kakaoAccount = await this.kakaoAccountRepository.findOne({
      select: {
        id: true,
      },
      where: {
        id: kakaoUserId,
      },
      relations: ['user'],
    });
    return kakaoAccount.user.id;
  }

  public async signUp({
    resKakaoUserInfo,
    userEntity,
    kakaoAccessToken,
  }: PropsSignUp) {
    // [Todo] resKakaoUserInfo에 담겨져 오는게 맞는 듯
    const userKakaoChanelList = await kakaoApi.getUserKakaoChanelList(
      kakaoAccessToken,
    );

    const kakaoAccount = this.kakaoAccountRepository.create({
      id: resKakaoUserInfo.data.id,
      profileNickname: resKakaoUserInfo.data.properties.nickname,
      accountEmail: resKakaoUserInfo.data.kakao_account.email,
      plusfriends: userKakaoChanelList.data.channels[0].relation,
      user: userEntity,
    });

    await this.kakaoAccountRepository.save(kakaoAccount);
  }
}

// [Todo] type 정리
type PropsSignUp = PropsSignIn & {
  userEntity: UserEntity;
};
