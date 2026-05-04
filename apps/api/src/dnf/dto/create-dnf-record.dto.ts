import { BOOK_DIFFICULTY, BOOK_PACING, DNF_REASONS } from '@bookcompass/shared';
import { Type } from 'class-transformer';
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

export class CreateDnfRecordDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsMongoId()
  bookId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  stoppedAtPercent: number;

  @IsIn(DNF_REASONS)
  reason: string;

  @IsOptional()
  @IsIn(BOOK_PACING)
  pacingSnapshot?: string;

  @IsOptional()
  @IsIn(BOOK_DIFFICULTY)
  difficultySnapshot?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
