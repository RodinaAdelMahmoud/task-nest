import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @Post('user/private/category')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
}
