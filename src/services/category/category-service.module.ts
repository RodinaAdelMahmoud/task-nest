import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './modules/controllers/category.controller';
import { CategoriesService } from './modules/controllers/category.service';
import { CategorySchema } from '@common/schemas/mongoose/category/category.schema';
import { ModelNames } from '@common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.CATEGORY, schema: CategorySchema }]), // Ensure the model is registered here
  ],
  controllers: [CategoryController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoryModule {}
