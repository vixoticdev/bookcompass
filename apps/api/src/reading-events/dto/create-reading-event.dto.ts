import { READING_EVENT_TYPES } from '@bookcompass/shared';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReadingEventDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  bookId: string;

  @IsIn(READING_EVENT_TYPES)
  eventType: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minutesRead?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  occurredAt?: Date;
}
