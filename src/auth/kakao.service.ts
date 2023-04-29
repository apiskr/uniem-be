import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResGetAuthCode } from 'src/api/kakaoAuth';
import { kakaoAuth } from 'src/api/kakaoAuth';
import { ENV_NAME } from 'src/constants/envName';
import { KakaoTokenDto } from './kakao.dto';
import { kakaoApi } from 'src/api/kakaoApi';
import { Repository } from 'typeorm';
import { KakaoAccountEntity } from 'src/user/kakao-account.entity';
import { UserEntity } from 'src/user/user.entity';
import { PropsSignIn } from './auth.service';

@Injectable()
export class KakaoService {
  private KAKAO_API_KEY: string;
  private REDIRECT_URI: string;

  public constructor(
    private readonly configService: ConfigService,
    @Inject('KakaoAccountRepository')
    private readonly kakaoAccountRepository: Repository<KakaoAccountEntity>,
  ) {
    this.KAKAO_API_KEY = this.configService.get<string>(
      ENV_NAME.KAKAO_REST_API_KEY,
    );
    this.REDIRECT_URI = this.configService.get<string>(ENV_NAME.REDIRECT_URI);
  }

  public openKakaoSignIn(): ResGetAuthCode {
    return kakaoAuth.getAuthCode(this.KAKAO_API_KEY, this.REDIRECT_URI);
  }

  public async getTokenFromKakao(code: string) {
    const res = await this.postKakaoToken(code);
    return new KakaoTokenDto(res.data); // [Todo] Dto 굳이 쓰는 느낌
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

  public async getUniemUserInfoByKakaoUserId(kakaoUserId: string) {
    return await this.kakaoAccountRepository.findOne({
      select: {
        id: true,
      },
      where: {
        id: kakaoUserId,
      },
    });
  }

  public async signUp({ resUserInfo, userEntity, accessToken }: PropsSignUp) {
    const userKakaoChanelList = await kakaoApi.getUserKakaoChanelList(
      accessToken,
    );

    const kakaoAccount = this.kakaoAccountRepository.create({
      id: resUserInfo.data.id,
      profileNickname: resUserInfo.data.properties.nickname,
      accountEmail: resUserInfo.data.kakao_account.email,
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
