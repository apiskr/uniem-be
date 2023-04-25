import axios from 'axios';
import { baseURLs } from 'src/constants/baseUrls';
import { routes } from 'src/constants/routes';

const kakaoAuthInstance = axios.create({
  baseURL: baseURLs.KAKAO_AUTH,
});

export type ResGetAuthCode = { url: string };

const getAuthCode = (
  KAKAO_API_KEY: string,
  REDIRECT_URI: string,
): ResGetAuthCode => {
  return {
    url: `${baseURLs.KAKAO_AUTH}${routes.OAUTH}/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`,
  };
};

const postKakaoToken = async (
  client_id: string,
  redirect_uri: string,
  code: string,
) => {
  return await kakaoAuthInstance.post(
    `${routes.OAUTH}/token`,
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
