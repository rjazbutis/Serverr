import { ProductDocument } from '../models/product-model';

export type ProductViewModel = {
  id: string,
  title: string,
  price: number,
  updatedAt: string,
  categoryIds: string[],
  images: string[],
};

const createProductViewModel = (productDoc: ProductDocument): ProductViewModel => ({
  id: productDoc._id.toString(),
  title: productDoc.title,
  price: productDoc.price,
  updatedAt: productDoc.updatedAt,
  categoryIds: productDoc.categories.map((categoryId) => categoryId.toString()),
  images: productDoc.images,
});

export default createProductViewModel;
