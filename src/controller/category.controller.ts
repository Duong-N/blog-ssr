import { categoryDTO } from '../dto/createCateDTO';
import { validateDTO } from '../helper/validateDTO';
import categoryModel from '../module/categoryModel';
import { NextFunction, Request, Response } from 'express';

export const createCategory = async (req: Request, res: Response) => {
    const categoryData = await validateDTO(categoryDTO, req.body, res, 'category');
    if (!categoryData) return;
    try {
        const checkEx = await categoryModel.findOne({ CategoryName: categoryData.CategoryName }).lean();
        if (checkEx) {
            const categories = await categoryModel.find().lean();
            return res.render('admin', { 
                partialContent: 'category',
                error: 'Danh mục đã tồn tại', 
                categories,
                message: null,
                categoryToEdit: {}
            });
        }
        const newCate = new categoryModel({ CategoryName: categoryData.CategoryName });
        await newCate.save();
        const categories = await categoryModel.find().lean();
        return res.render('admin', { 
            partialContent: 'category',
            message: 'Tạo danh mục thành công', 
            categories,
            error: null,
            categoryToEdit: {}
        });
    } catch (error) {
        console.error(error);
        const categories = await categoryModel.find().lean();
        return res.render('admin', { 
            partialContent: 'category',
            error: 'Lỗi server', 
            categories,
            message: null,
            categoryToEdit: {}
        });
    }
};

export const FindAllCategory = async (req: Request, res: Response) => {
    try {
        const findAll = await categoryModel.find().lean();
        console.log('Danh sách danh mục:', findAll);
        return res.render('admin', { 
            partialContent: 'category',
            categories: findAll, 
            error: null,
            message: req.query.message || null, // Hỗ trợ thông báo từ redirect
            categoryToEdit: {}
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        return res.render('admin', { 
            partialContent: 'category',
            error: 'Lỗi server', 
            categories: [],
            message: null,
            categoryToEdit: {}
        });
    }
};

export const DeleteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            const categories = await categoryModel.find().lean();
            return res.render('admin', {
                partialContent: 'category',
                error: 'ID danh mục không hợp lệ',
                categories,
                message: null,
                categoryToEdit: {}
            });
        }
        const deletedCategory = await categoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            const categories = await categoryModel.find().lean();
            return res.render('admin', {
                partialContent: 'category',
                error: 'Không tìm thấy danh mục',
                categories,
                message: null,
                categoryToEdit: {}
            });
        }
        // Redirect với thông báo
        res.redirect('/admin/category?message=Xóa danh mục thành công');
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        const categories = await categoryModel.find().lean();
        return res.render('admin', {
            partialContent: 'category',
            error: 'Lỗi server khi xóa danh mục',
            categories,
            message: null,
            categoryToEdit: {}
        });
    }
};
export const loadCategoriesForHeader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryModel.find().lean();
        res.locals.categories = categories; // Gắn danh mục vào res.locals để tất cả view đều truy cập được
        next(); // Chuyển tiếp đến middleware hoặc route tiếp theo
    } catch (error) {
        console.error('Lỗi khi tải danh mục cho header:', error);
        res.locals.categories = []; // Nếu lỗi, trả về mảng rỗng để tránh lỗi render
        next();
    }
};