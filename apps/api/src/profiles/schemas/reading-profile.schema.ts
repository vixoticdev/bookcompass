import {
  BOOK_DIFFICULTY,
  BOOK_FORMATS,
  BOOK_PACING,
  OUTCOME_KEYS,
  READING_DEPTHS,
} from '@bookcompass/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReadingProfileDocument = HydratedDocument<ReadingProfile>;

@Schema({ timestamps: true })
export class ReadingProfile {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: string;

  @Prop({ type: [String], default: [] })
  favoriteGenres: string[];

  @Prop({ type: [String], default: [] })
  dislikedGenres: string[];

  @Prop({ type: [String], enum: OUTCOME_KEYS, default: [] })
  targetOutcomes: string[];

  @Prop({ enum: READING_DEPTHS, default: 'balanced' })
  preferredDepth: string;

  @Prop({ enum: BOOK_PACING, default: 'moderate' })
  pacingTolerance: string;

  @Prop({ enum: BOOK_DIFFICULTY, default: 'moderate' })
  difficultyTolerance: string;

  @Prop({ type: [String], enum: BOOK_FORMATS, default: ['ebook'] })
  preferredFormats: string[];

  @Prop({ min: 1, max: 1440, default: 30 })
  dailyReadingMinutes: number;

  @Prop({ min: 50, max: 1000, default: 250 })
  estimatedWordsPerMinute: number;
}

export const ReadingProfileSchema =
  SchemaFactory.createForClass(ReadingProfile);
