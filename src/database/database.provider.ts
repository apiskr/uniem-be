import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        ssl: false,
        synchronize: false,
        logging: process.env.NODE_ENV === 'dev',
        subscribers: ['src/subscriber/**/*.ts'], // [Todo] subscriber 추가
        migrations: [__dirname + '/migrations/**/*.ts'],
        migrationsTableName: 'migrations',
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
