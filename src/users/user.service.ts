import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }
  async deleteOne(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { active: false })
      .exec();
    return null;
  }
}
