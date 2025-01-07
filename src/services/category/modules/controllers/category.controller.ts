import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CustomResponse, Persona } from '@common';

@Controller('category')
@ApiTags('Categories')
export class CategoryController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @Post('user/private/category')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  @Get('user/private/categories')
  async getCategories() {
    return this.categoriesService.getCategories();
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @Patch('user/private/category')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto, // Use UpdateCategoryDto here
  ) {
    return this.categoriesService.updateCategory(updateCategoryDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @Patch('user/private/category/delete')
  async deleteCategory(@Persona() userJwt: any, @Param('id') param: string) {
    const result = await this.categoriesService.deleteCategory(param);

    return new CustomResponse().success({
      payload: { data: result },
    });
  }
}
