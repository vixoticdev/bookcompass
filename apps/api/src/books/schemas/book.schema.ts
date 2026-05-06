import {
  BOOK_DIFFICULTY,
  BOOK_FORMATS,
  BOOK_PACING,
  OUTCOME_KEYS,
  READING_DEPTHS,
} from '@bookcompass/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Author',
    required: true,
    index: true,
  })
  authorId: string;

  @Prop({ trim: true })
  isbn?: string;

  @Prop({ trim: true })
  subtitle?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ min: 0 })
  publishedYear?: number;

  @Prop({ trim: true, default: 'en' })
  language?: string;

  @Prop({ type: [String], default: [], index: true })
  genres: string[];

  @Prop({ type: [String], enum: OUTCOME_KEYS, default: [], index: true })
  outcomeTags: string[];

  @Prop({ enum: BOOK_PACING, default: 'moderate' })
  pacing: string;

  @Prop({ enum: BOOK_DIFFICULTY, default: 'moderate' })
  difficulty: string;

  @Prop({ enum: READING_DEPTHS, default: 'balanced' })
  depth: string;

  @Prop({ type: [String], enum: BOOK_FORMATS, default: ['ebook'] })
  formats: string[];

  @Prop({ min: 1 })
  pageCount?: number;

  @Prop({ min: 1 })
  estimatedMinutes?: number;

  @Prop({ trim: true })
  googleBooksVolumeId?: string;

  @Prop({ trim: true })
  thumbnailUrl?: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ title: 1, authorId: 1 }, { unique: true });
