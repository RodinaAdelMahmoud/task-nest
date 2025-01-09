import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'New Category Title',
    description: 'The updated title of the category',
  })
  @IsString()
  newTitle: string;
}
