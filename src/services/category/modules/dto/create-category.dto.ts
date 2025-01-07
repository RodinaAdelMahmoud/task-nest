import { CategoryTypeEnum } from '@common/schemas/mongoose/category/category.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(CategoryTypeEnum, { message: 'Invalid category type' })
  @IsOptional()
  type?: CategoryTypeEnum;

  @IsNotEmpty()
  createdBy: Types.ObjectId;
}
