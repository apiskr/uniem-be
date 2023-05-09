import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PROVIDER } from 'src/constants/provider';
import { JwtService } from '@nestjs/jwt';
import { TOKEN } from 'src/constants/bearer';
import { UserInfo } from './kakao.service';

// [Todo] 잘 되는지 테스트하기
@Injectable()
export class AuthService {
  public constructor(
    @Inject(PROVIDER.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private async getAppUserIdByKakaoUserId(kakaoUserId: string) {
    const kakaoAccount = await this.userRepository.findOne({
      select: {
        kakaoUserId: true,
      },
      where: {
        kakaoUserId,
      },
    });
    return kakaoAccount?.id ?? null;
  }

  // [Todo] Exception 클래스 공부 + try catch 문으로 예외처리
  public async signIn(userInfo: UserInfo) {
    const resUserId = await this.getAppUserIdByKakaoUserId(userInfo.id);

    if (resUserId === null) await this.signUp(userInfo);

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

  private async signUp(userInfo: UserInfo) {
    const user = this.userRepository.create({
      id: uuid(),
      nickname: userInfo.properties.nickname,
      major: null,
      grade: null,
      point: 0,
      fieldsOfConfidence: null,
      refreshToken: null,
      kakaoUserId: userInfo.id,
      kakaoAccountEmail: userInfo.kakao_account.email,
      addedKakaoPlusfriend: userInfo.addedKakaoPlusfriend,
      createdAt: new Date(),
    });
    await this.userRepository.save(user);
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

  public async signOut(userId: string) {
    await this.userRepository.update({ id: userId }, { refreshToken: null });
  }

  // [Todo] 회원탈퇴
  // [Todo] 회원정보 수정
  // [Todo] 회원정보 조회
}
