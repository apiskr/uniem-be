import axios from 'axios';
import { baseURLs } from 'src/constants/baseUrls';

const ROUTE = '/v2/user/me';

const kakaoApiInstance = axios.create({
  baseURL: baseURLs.KAKAO_API,
});

const getUserInfo = async (accessToken: string) => {
  return await kakaoApiInstance.get(`${ROUTE}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

export const kakaoApi = { getUserInfo };
