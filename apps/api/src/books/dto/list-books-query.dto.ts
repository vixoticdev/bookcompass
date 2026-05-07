import {
  BOOK_DIFFICULTY,
  BOOK_FORMATS,
  BOOK_PACING,
  CATALOG_ENRICHMENT_STATUSES,
  OUTCOME_KEYS,
  READING_DEPTHS,
} from '@bookcompass/shared';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListBooksQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(220)
  q?: string;

  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  genre?: string;

  @IsOptional()
  @IsIn(OUTCOME_KEYS)
  outcome?: string;

  @IsOptional()
  @IsIn(BOOK_PACING)
  pacing?: string;

  @IsOptional()
  @IsIn(BOOK_DIFFICULTY)
  difficulty?: string;

  @IsOptional()
  @IsIn(READING_DEPTHS)
  depth?: string;

  @IsOptional()
  @IsIn(BOOK_FORMATS)
  format?: string;

  @IsOptional()
  @IsIn(CATALOG_ENRICHMENT_STATUSES)
  enrichmentStatus?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  recommendationEligible?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  styleTag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  riskTag?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100000)
  maxEstimatedMinutes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}
