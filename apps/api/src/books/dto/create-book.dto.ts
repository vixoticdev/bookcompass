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
  IsISBN,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(220)
  title: string;

  @IsMongoId()
  authorId: string;

  @IsOptional()
  @IsISBN()
  isbn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(3000)
  publishedYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  language?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsIn(OUTCOME_KEYS, { each: true })
  outcomeTags?: string[];

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
  @IsArray()
  @ArrayMaxSize(4)
  @IsIn(BOOK_FORMATS, { each: true })
  formats?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5000)
  pageCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100000)
  estimatedMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  googleBooksVolumeId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  thumbnailUrl?: string;
}
