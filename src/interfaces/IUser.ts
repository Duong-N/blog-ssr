import { Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  avatar?: string | '';
  role: 'user' | 'admin';
  createAt?: Date;
  updateAt?: Date | '';
}
