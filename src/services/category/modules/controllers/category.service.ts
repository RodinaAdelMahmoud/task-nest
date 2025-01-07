import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './../../../../common/schemas/mongoose/category/category.type';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from './../dto/update-category.dto';
import { errorManager } from 'src/services/authentication/shared/config/errors.config';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const Category = new this.categoryModel(createCategoryDto);
    return Category.save();
  }

  async getCategories() {
    const categories = await this.categoryModel.find({ isDeleted: false });
    if (!categories || categories.length === 0) {
      return [];
    }

    return categories;
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { title, newTitle, ...updateFields } = updateCategoryDto;

    const updatedCategory = await this.categoryModel.findOneAndUpdate(
      { title },
      { ...updateFields, ...(newTitle && { title: newTitle }) },
      { new: true },
    );

    if (!updatedCategory) {
      throw new NotFoundException('Category not found or could not be updated');
    }

    return updatedCategory;
  }

  async deleteCategory(categoryId: string) {
    const category = await this.categoryModel.findOneAndUpdate(
      { id: categoryId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!category) {
      throw new NotFoundException(errorManager.CATEGORY_NOT_FOUND);
    }

    return category;
  }
}
