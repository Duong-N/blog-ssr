import mongoose, { Document } from 'mongoose';

// interfaces/IBlog.ts
export interface IBlog extends Document {
    title: string;
    content: string;
    category:  mongoose.Types.ObjectId; 
    image?: string;
    author?: string;
    createdAt?: Date;
    featured?: boolean;
}