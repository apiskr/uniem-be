import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { userProvider } from './user.provider';

@Module({
  providers: [...databaseProviders, ...userProvider],
  exports: [...databaseProviders, ...userProvider],
})
export class DatabaseModule {}
