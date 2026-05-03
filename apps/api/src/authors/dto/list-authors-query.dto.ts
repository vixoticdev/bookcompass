import { OUTCOME_KEYS } from '@bookcompass/shared';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ListAuthorsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  genre?: string;

  @IsOptional()
  @IsIn(OUTCOME_KEYS)
  outcome?: string;
}
