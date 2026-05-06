import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  authProviderId?: string;
}
