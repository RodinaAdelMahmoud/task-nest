import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}
