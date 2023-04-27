import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// import { PhotoEntity } from 'src/photo/photo.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        // entities: [PhotoEntity], // [Error] 밑에 코드 안 먹음
        // entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
