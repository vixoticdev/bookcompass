import { OUTCOME_KEYS } from '@bookcompass/shared';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  knownForGenres?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsIn(OUTCOME_KEYS, { each: true })
  outcomeStrengths?: string[];
}
