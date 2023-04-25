import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true, // 앱 전체에서 의존성 주입 코드 없이도 주입 가능
    }),
  ],
})
export class ConfigurationModule {}
