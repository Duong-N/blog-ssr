import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '',required: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: '' },
});

const userModel = model<IUser>('User', userSchema);
export default userModel;
