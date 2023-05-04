import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserGuard } from './user.guard';
import { PROVIDER } from 'src/constants/provider';

@Module({
  controllers: [UserController],
  providers: [{ provide: PROVIDER.USER_GUARD, useClass: UserGuard }],
})
export class UserModule {}
