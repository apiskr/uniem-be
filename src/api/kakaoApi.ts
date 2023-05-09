import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from 'src/constants/baseUrl';
import { ADDED_KAKAO_PLUS_FLRIEND } from 'src/constants/entity';

const V1 = 'v1';
const V2 = 'v2';

const kakaoApiInstance = axios.create({
  baseURL: BASE_URL.KAKAO_API,
});

export type ResGetUserInfo = {
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
  return await kakaoApiInstance.get(`${V2}/user/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

type ResGetUserKakaoChanelList = {
  user_id: string;
  channels: {
    channel_uuid: string;
    channel_public_id: string;
    relation: ADDED_KAKAO_PLUS_FLRIEND;
    updated_at?: string;
  }[];
};

const getUserKakaoChanelList = async (
  accessToken: string,
): Promise<AxiosResponse<ResGetUserKakaoChanelList>> => {
  return await kakaoApiInstance.get(
    `${V1}/api/talk/channels?channel_public_ids=["${process.env.APP_CHANEL_ID}"]`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const kakaoApi = { getUserInfo, getUserKakaoChanelList };
