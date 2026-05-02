import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  displayName: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({ trim: true })
  authProviderId?: string;

  @Prop({ default: 'reader', enum: ['reader', 'admin'] })
  role: 'reader' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
