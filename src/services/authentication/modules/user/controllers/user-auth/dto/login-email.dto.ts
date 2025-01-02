import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserLoginEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
