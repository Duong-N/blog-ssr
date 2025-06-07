// module/blogModel.js
import mongoose, { Schema, model } from 'mongoose';
import { IBlog } from '../interfaces/IBlog';

const blogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    featured: {
        type: Boolean,
        default: false
    }
});

const blogModel = model<IBlog>('Blog', blogSchema);
export default blogModel;