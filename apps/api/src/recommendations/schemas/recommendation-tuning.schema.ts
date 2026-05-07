import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecommendationTuningDocument =
  HydratedDocument<RecommendationTuning>;

export type RecommendationTuningConfig = {
  key: string;
  outcomeFitWeight: number;
  personalFitWeight: number;
  contextFitWeight: number;
  timeFitWeight: number;
  behaviorFitWeight: number;
  dnfRiskWeight: number;
  maxRecommendations: number;
  note?: string;
};

export const DEFAULT_RECOMMENDATION_TUNING: RecommendationTuningConfig = {
  key: 'active',
  outcomeFitWeight: 1,
  personalFitWeight: 1,
  contextFitWeight: 1,
  timeFitWeight: 1,
  behaviorFitWeight: 1,
  dnfRiskWeight: 1,
  maxRecommendations: 10,
};

@Schema({ timestamps: true })
export class RecommendationTuning {
  @Prop({ default: 'active', unique: true, index: true })
  key: string;

  @Prop({ default: 1, min: 0, max: 3, required: true })
  outcomeFitWeight: number;

  @Prop({ default: 1, min: 0, max: 3, required: true })
  personalFitWeight: number;

  @Prop({ default: 1, min: 0, max: 3, required: true })
  contextFitWeight: number;

  @Prop({ default: 1, min: 0, max: 3, required: true })
  timeFitWeight: number;

  @Prop({ default: 1, min: 0, max: 3, required: true })
  behaviorFitWeight: number;

  @Prop({ default: 1, min: 0, max: 3, required: true })
  dnfRiskWeight: number;

  @Prop({ default: 10, min: 1, max: 20, required: true })
  maxRecommendations: number;

  @Prop({ maxlength: 1000 })
  note?: string;
}

export const RecommendationTuningSchema =
  SchemaFactory.createForClass(RecommendationTuning);
