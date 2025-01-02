import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
    message:
      'Password must include at least 8 characters with a small letter, a capital letter, a number, and a symbol.',
  })
  newPassword: string;
}
