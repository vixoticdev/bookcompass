import {
  BOOK_DIFFICULTY,
  BOOK_FORMATS,
  BOOK_PACING,
  OUTCOME_KEYS,
  READING_DEPTHS,
} from '@bookcompass/shared';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReadingProfileDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  favoriteGenres?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  dislikedGenres?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsIn(OUTCOME_KEYS, { each: true })
  targetOutcomes?: string[];

  @IsOptional()
  @IsIn(READING_DEPTHS)
  preferredDepth?: string;

  @IsOptional()
  @IsIn(BOOK_PACING)
  pacingTolerance?: string;

  @IsOptional()
  @IsIn(BOOK_DIFFICULTY)
  difficultyTolerance?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsIn(BOOK_FORMATS, { each: true })
  preferredFormats?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1440)
  dailyReadingMinutes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(50)
  @Max(1000)
  estimatedWordsPerMinute?: number;
}
