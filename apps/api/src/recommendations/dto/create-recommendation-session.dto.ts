import {
  ENERGY_LEVELS,
  FOCUS_LEVELS,
  MOOD_KEYS,
  OUTCOME_KEYS,
  READING_DEPTHS,
} from '@bookcompass/shared';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsMongoId,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateRecommendationContextDto {
  @IsIn(OUTCOME_KEYS)
  selectedOutcome: string;

  @IsIn(MOOD_KEYS)
  mood: string;

  @IsIn(ENERGY_LEVELS)
  energyLevel: string;

  @IsIn(FOCUS_LEVELS)
  focusLevel: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1440)
  availableMinutes: number;

  @IsIn(READING_DEPTHS)
  preferredDepth: string;
}

export class CreateRecommendationSessionDto {
  @IsMongoId()
  userId: string;

  @ValidateNested()
  @Type(() => CreateRecommendationContextDto)
  context: CreateRecommendationContextDto;
}
