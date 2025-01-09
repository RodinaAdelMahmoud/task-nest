import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './../../../../common/schemas/mongoose/category/category.type';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { errorManager } from 'src/services/authentication/shared/config/errors.config';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const Category = new this.categoryModel(createCategoryDto);
    return Category.save();
  }

  async getCategories(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const categories = await this.categoryModel.find({ isDeleted: false }).skip(skip).limit(limit);

    const totalCategories = await this.categoryModel.countDocuments({ isDeleted: false });

    // Calculate total pages
    const totalPages = Math.ceil(totalCategories / limit);

    return {
      categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalCategories,
        limit,
      },
    };
  }

  async updateCategory(id: string, newTitle: string) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, { title: newTitle }, { new: true });

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
