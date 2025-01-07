import { Category } from '@common/schemas/mongoose/category';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(PickType(Category, ['title'] as const)) {
  @ApiProperty({
    example: 'Category Title',
    description: 'category title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'New Category Title',
    description: 'The updated title of the category',
    required: false,
  })
  @IsOptional()
  @IsString()
  newTitle?: string;
}
