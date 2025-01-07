import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Model } from 'mongoose';

export class User {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  code: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export interface IUserInstanceMethods {
  comparePassword(password: string): Promise<boolean>;
}
export interface IUserModel extends Model<User, Record<string, unknown>, IUserInstanceMethods> {}
