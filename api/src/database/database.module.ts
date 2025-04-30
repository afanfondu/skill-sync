import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './database.config';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (configuration: ConfigType<typeof databaseConfig>) => ({
        type: 'mysql',
        ...configuration,
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
      }),
      inject: [databaseConfig.KEY],
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
