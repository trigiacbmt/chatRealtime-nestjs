import {
  HttpStatus,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user;
  }
  signToken(payload: any) {
    return this.jwtService.sign(payload);
  }
  async createSendToken(user: UserDocument) {
    const token = this.signToken(user);
    user.password = undefined;
    return {
      user,
      token,
    };
  }

  async comparePassword(
    password: string,
    candicatePassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, candicatePassword);
  }

  async login(user: UserDocument) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.signToken(payload),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument> | null {
    const user = await this.userModel.findOne({ email }).exec();
    // console.log(this.configService.get<string>('JWT_SECRET'));
    const checkPassword = this.comparePassword(password, user.password);
    if (!checkPassword) {
      return null;
    }
    return user;
  }
}
