import { CategoryDocument } from '../models/category-model';

export type CategoryViewModel = {
  id: string,
  title: string,
  imgSrc?: string,
  updatedAt: string,
};

const createCategoryViewModel = (categoryDoc: CategoryDocument): CategoryViewModel => ({
  id: categoryDoc._id.toString(),
  title: categoryDoc.title,
  imgSrc: categoryDoc.imgSrc,
  updatedAt: categoryDoc.updatedAt,
});

export default createCategoryViewModel;
