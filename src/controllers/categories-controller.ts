import { RequestHandler } from 'express';
import CategoryModel, { CategoryProps } from '../models/category-model';
import createCategoryViewModel, { CategoryViewModel } from '../view-model-creators/create-category-view-model';

type SingularCategoryResponse = { category: CategoryViewModel } | ErrorResponseBody;

export const getCategories: RequestHandler<
  unknown,
  { categories: CategoryViewModel[] }
> = async (req, res) => {
  const categoryDocs = await CategoryModel.find();

  res.status(200).json({
    categories: categoryDocs.map((categoryDoc) => createCategoryViewModel(categoryDoc)),
  });
};

export const getCategory: RequestHandler<
  { id: string },
  SingularCategoryResponse
> = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryDoc = await CategoryModel.findById(id);
    if (categoryDoc === null) {
      throw new Error(`Kategorija su id '${id}' nerasta`);
    }

    res.status(200).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Klaida ieškant kategorijos',
    });
  }
};

export const createCategory: RequestHandler<
  unknown,
  SingularCategoryResponse,
  CategoryProps
> = async (req, res) => {
  const categoryProps = req.body;

  try {
    const categoryDoc = await CategoryModel.create(categoryProps);
    res.status(201).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (err) {
    res.status(400).json({ error: 'Serverio klaida kuriant kategoriją' });
  }
};

export const updateCategory: RequestHandler<
  { id: string },
  SingularCategoryResponse,
  Partial<CategoryProps>
> = async (req, res) => {
  const { id } = req.params;
  const categoryProps = req.body;

  try {
    const categoryDoc = await CategoryModel.findByIdAndUpdate(id, categoryProps, { new: true });
    if (categoryDoc === null) {
      throw new Error(`Kategorija su id '${id}' nerasta atliekant atnaujinimą`);
    }

    res.status(200).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Serverio klaida atnaujinant kategoriją',
    });
  }
};

export const deleteCategory: RequestHandler<
  { id: string },
  SingularCategoryResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryDoc = await CategoryModel.findByIdAndDelete(id);
    if (categoryDoc === null) {
      throw new Error(`Kategorija su id '${id}' nerastas`);
    }

    res.status(200).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Serverio klaida trinant kategoriją',
    });
  }
};
