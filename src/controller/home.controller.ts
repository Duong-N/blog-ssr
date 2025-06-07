import { Request, Response } from 'express';
import blogModel from '../module/blogModel';

export const getHomePage = async (req: Request, res: Response) => {
    try {
        const blogs = await blogModel
            .find()
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày mới nhất
            .limit(3) // Giới hạn 3 bài
            .lean();
        res.render('home', {
            blogs,
            error: null
        });
    } catch (error) {
        console.error('Lỗi khi tải trang home:', error);
        res.render('home', {
            blogs: [],
            error: 'Lỗi server'
        });
    }
};
