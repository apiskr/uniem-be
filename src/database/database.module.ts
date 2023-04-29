import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { userProvider } from './user.provider';
import { kakaoAccountProvider } from './kakaoAccount.provider';

@Module({
  providers: [...databaseProviders, ...userProvider, ...kakaoAccountProvider],
  exports: [...databaseProviders, ...userProvider, ...kakaoAccountProvider],
})
export class DatabaseModule {}
