import {
  ENERGY_LEVELS,
  FOCUS_LEVELS,
  MOOD_KEYS,
  OUTCOME_KEYS,
  READING_DEPTHS,
} from '@bookcompass/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RecommendationSessionDocument =
  HydratedDocument<RecommendationSession>;

@Schema({ _id: false })
export class RecommendationContext {
  @Prop({ enum: OUTCOME_KEYS, required: true })
  selectedOutcome: string;

  @Prop({ enum: MOOD_KEYS, required: true })
  mood: string;

  @Prop({ enum: ENERGY_LEVELS, required: true })
  energyLevel: string;

  @Prop({ enum: FOCUS_LEVELS, required: true })
  focusLevel: string;

  @Prop({ min: 1, max: 1440, required: true })
  availableMinutes: number;

  @Prop({ enum: READING_DEPTHS, required: true })
  preferredDepth: string;
}

export const RecommendationContextSchema = SchemaFactory.createForClass(
  RecommendationContext,
);

@Schema({ _id: false })
export class RecommendationCandidate {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  bookId: string;

  @Prop({ required: true })
  finalScore: number;

  @Prop({ type: Object, default: {} })
  scoreBreakdown: Record<string, number>;

  @Prop({ type: [Object], default: [] })
  signals: Array<Record<string, unknown>>;

  @Prop({ type: [String], default: [] })
  explanation: string[];
}

export const RecommendationCandidateSchema = SchemaFactory.createForClass(
  RecommendationCandidate,
);

@Schema({ timestamps: true })
export class RecommendationSession {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: string;

  @Prop({ type: RecommendationContextSchema, required: true })
  context: RecommendationContext;

  @Prop({ type: [RecommendationCandidateSchema], default: [] })
  candidates: RecommendationCandidate[];

  @Prop({
    default: 'created',
    enum: ['created', 'scored', 'served', 'feedback-recorded'],
    index: true,
  })
  status: string;
}

export const RecommendationSessionSchema = SchemaFactory.createForClass(
  RecommendationSession,
);
RecommendationSessionSchema.index({ userId: 1, createdAt: -1 });
