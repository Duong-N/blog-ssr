import { Schema, model } from 'mongoose';
import { ICategory } from '../interfaces/ICategory';

const categorySchema = new Schema<ICategory>({
  CategoryName: { type: String },
});
const categoryModel = model<ICategory>('Category', categorySchema);
export default categoryModel;
