import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/user.module';

@Module({
  imports: [
    // === configure .env to load env variables ===
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // === connect mongodb database ===
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
