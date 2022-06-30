import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({
    required: [true, 'User must have a username'],
  })
  username: string;
  @Prop({
    required: [true, 'User must have a email'],
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;
  @Prop({
    required: [true, 'User must have a password'],
    minlength: [8, 'Password must be greater than 8 characters'],
  })
  password: string;
  @Prop({
    default: 'user',
  })
  role: string;
  @Prop()
  passwordChangedAt: Date;
  @Prop()
  passwordResetToken: string;
  @Prop()
  passwordResetExpires: Date;
  @Prop({
    default: true,
  })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.pre('find', async function (next: NextFunction) {
  this.find({ active: { $ne: false } });
  next();
});
