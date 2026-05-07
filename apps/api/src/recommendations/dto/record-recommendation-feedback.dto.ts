import { RECOMMENDATION_FEEDBACK_STATUSES } from '@bookcompass/shared';
import {
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecordRecommendationFeedbackDto {
  @IsMongoId()
  bookId: string;

  @IsIn(RECOMMENDATION_FEEDBACK_STATUSES)
  status: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
