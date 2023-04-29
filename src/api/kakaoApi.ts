import axios, { AxiosResponse } from 'axios';
import { baseURLs } from 'src/constants/baseUrls';

const ROUTE = '/v2/user/me';

const kakaoApiInstance = axios.create({
  baseURL: baseURLs.KAKAO_API,
});

type ResGetUserInfo = {
  id: string;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
    has_age_range: boolean;
    age_range_needs_agreement: boolean;
    age_range: string;
    has_birthday: boolean;
    birthday_needs_agreement: boolean;
    birthday: string;
    birthday_type: string;
  };
};

const getUserInfo = async (
  accessToken: string,
): Promise<AxiosResponse<ResGetUserInfo>> => {
  return await kakaoApiInstance.get(`${ROUTE}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

export const kakaoApi = { getUserInfo };
