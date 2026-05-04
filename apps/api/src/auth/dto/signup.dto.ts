import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
