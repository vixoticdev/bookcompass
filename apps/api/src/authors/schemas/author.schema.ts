import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  bio?: string;

  @Prop({ type: [String], default: [] })
  knownForGenres: string[];

  @Prop({ type: [String], default: [] })
  outcomeStrengths: string[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
AuthorSchema.index({ name: 1 }, { unique: true });
