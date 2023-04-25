import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [AuthModule, ConfigurationModule],
  controllers: [AppController],
})
export class AppModule {}
