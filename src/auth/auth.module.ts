import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from 'src/users/user.model';
import { UserModule } from 'src/users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStragety } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>('JWT_SECRET'));
        return {
          secret: '1231231asdasdad',
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    // JwtModule.register({
    //   secret: '1231231asdasdad',
    //   signOptions: {
    //     expiresIn: '1d',
    //   },
    // }),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JwtStragety],
  exports: [AuthService],
})
export class AuthModule {}
