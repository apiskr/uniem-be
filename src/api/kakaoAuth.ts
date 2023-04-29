import axios, { AxiosResponse } from 'axios';
import { baseURLs } from 'src/constants/baseUrls';

const Route = '/oauth';

const kakaoAuthInstance = axios.create({
  baseURL: baseURLs.KAKAO_AUTH,
});

export type ResGetAuthCode = { url: string };

const getAuthCode = (
  KAKAO_API_KEY: string,
  REDIRECT_URI: string,
): ResGetAuthCode => {
  return {
    url: `${baseURLs.KAKAO_AUTH}${Route}/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`,
  };
};

export type ResPostKakaoToken = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
};

const postKakaoToken = async (
  client_id: string,
  redirect_uri: string,
  code: string,
): Promise<AxiosResponse<ResPostKakaoToken>> => {
  return await kakaoAuthInstance.post(
    `${Route}/token`,
    {
      grant_type: 'authorization_code',
      client_id,
      redirect_uri,
      code,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    },
  );
};

export const kakaoAuth = { getAuthCode, postKakaoToken };
