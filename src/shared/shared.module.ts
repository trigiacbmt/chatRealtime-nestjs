import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { MongoModule } from './mongo.module';

@Module({
  imports: [ConfigModule, MongoModule],
  exports: [ConfigModule, MongoModule],
})
export class SharedModule {}
