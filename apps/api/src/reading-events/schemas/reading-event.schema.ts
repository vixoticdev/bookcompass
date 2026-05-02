import { READING_EVENT_TYPES } from '@bookcompass/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReadingEventDocument = HydratedDocument<ReadingEvent>;

@Schema({ timestamps: true })
export class ReadingEvent {
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

  @Prop({ enum: READING_EVENT_TYPES, required: true, index: true })
  eventType: string;

  @Prop({ min: 0, max: 100 })
  progressPercent?: number;

  @Prop({ min: 0 })
  minutesRead?: number;

  @Prop({ trim: true })
  note?: string;

  @Prop({ default: Date.now, index: true })
  occurredAt: Date;
}

export const ReadingEventSchema = SchemaFactory.createForClass(ReadingEvent);
ReadingEventSchema.index({ userId: 1, occurredAt: -1 });
ReadingEventSchema.index({ userId: 1, bookId: 1, eventType: 1 });
