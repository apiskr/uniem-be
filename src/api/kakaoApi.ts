import axios from 'axios';
import { baseURLs } from 'src/constants/baseUrls';

const ROUTE = '/v1/oidc/userinfo';

const kakaoApiInstance = axios.create({
  baseURL: baseURLs.KAKAO_API,
});

const getOidcUserinfo = async (accessToken: string) => {
  return await kakaoApiInstance.get(`${ROUTE}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

export const kakaoApi = { getOidcUserinfo };
