import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './../../../../common/schemas/mongoose/category/category.type';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const Category = new this.categoryModel(createCategoryDto);
    return Category.save();
  }

  async getCategories(createdBy: string) {
    return this.categoryModel.find({ createdBy, isDeleted: false });
  }
}
