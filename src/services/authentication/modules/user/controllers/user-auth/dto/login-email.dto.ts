import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginEmailDto {
  @ApiProperty({ example: 'user@example.com', description: 'The user email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword123', description: 'The user password' })
  @IsString()
  password: string;
}
