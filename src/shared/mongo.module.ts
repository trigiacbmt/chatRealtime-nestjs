import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('MONGODB_URL');
        const urlChangedPassword = url.replace(
          '<password>',
          configService.get<string>('MONGODB_PASSWORD'),
        );
        return {
          uri: urlChangedPassword,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
