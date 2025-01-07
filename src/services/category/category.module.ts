import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './modules/controllers/category.controller';
import { CategoriesService } from './modules/controllers/category.service';
import { CategorySchema } from '@common/schemas/mongoose/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]), // Registers the Category model with Mongoose
  ],
  controllers: [CategoryController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoryModule {}
