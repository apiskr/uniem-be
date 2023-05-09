export const enum TOKEN {
  AUTHORIZATION = 'authorization',
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN_EXPIRES_IN = '1h',
  REFRESH_TOKEN_EXPIRES_IN = '7d',
  BEARER_PREFIX = 'Bearer',
}

export const enum COOKIE {
  COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7,
}
