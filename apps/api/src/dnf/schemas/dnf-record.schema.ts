import { BOOK_DIFFICULTY, BOOK_PACING, DNF_REASONS } from '@bookcompass/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type DnfRecordDocument = HydratedDocument<DnfRecord>;

@Schema({ timestamps: true })
export class DnfRecord {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true,
  })
  bookId: string;

  @Prop({ min: 0, max: 100, required: true })
  stoppedAtPercent: number;

  @Prop({ enum: DNF_REASONS, required: true, index: true })
  reason: string;

  @Prop({ enum: BOOK_PACING })
  pacingSnapshot?: string;

  @Prop({ enum: BOOK_DIFFICULTY })
  difficultySnapshot?: string;

  @Prop({ trim: true })
  note?: string;
}

export const DnfRecordSchema = SchemaFactory.createForClass(DnfRecord);
DnfRecordSchema.index({ userId: 1, bookId: 1 }, { unique: true });
DnfRecordSchema.index({ userId: 1, createdAt: -1 });
