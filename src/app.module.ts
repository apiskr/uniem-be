import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    AuthModule,
    ConfigurationModule,
    DatabaseModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
