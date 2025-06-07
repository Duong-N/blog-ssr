// controllers/blogController.js
import { Request, Response } from 'express';
import { BlogDTO } from '../dto/createBlogDTO';
import { validateDTO } from '../helper/validateDTO';
import blogModel from '../module/blogModel';
import categoryModel from '../module/categoryModel';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose'; // Thêm để sử dụng ObjectId
// Hiển thị trang chủ (bài viết mới nhất)


// Hiển thị form đăng bài
export const getBlogForm = async (req: Request, res: Response) => {
    try {
        const categories = await categoryModel.find().lean();
        const blogs = await blogModel.find().lean();
        res.render('admin', {
            partialContent: 'blog',
            categories,
            blogs,
            error: null,
            message: null,
            blogToEdit: {}
        });
    } catch (error) {
        console.error('Lỗi khi tải form blog:', error);
        res.render('admin', {
            partialContent: 'blog',
            categories: [],
            blogs: [],
            error: 'Lỗi server',
            message: null,
            blogToEdit: {}
        });
    }
};

// Tạo bài viết
export const createBlog = async (req: Request, res: Response) => {
    const blogData = await validateDTO(BlogDTO, req.body, res, 'blog');
    if (!blogData) return;

    try {
        const categoryExists = await categoryModel.findById(blogData.category).lean();
        if (!categoryExists) {
            const categories = await categoryModel.find().lean();
            return res.render('admin', { 
                partialContent: 'blog',
                error: 'Danh mục không tồn tại',
                categories,
                blogs: await blogModel.find().lean(),
                blogToEdit: {}
            });
        }

        const imageFileName = req.file ? req.file.filename : null; // Chỉ lưu tên file

        const newBlog = new blogModel({
            title: blogData.title,
            content: blogData.content,
            category: blogData.category,
            image: imageFileName, // Lưu tên file thay vì đường dẫn
            author: blogData.author || 'Admin',
            featured: blogData.featured || false
        });
        await newBlog.save();

        const categories = await categoryModel.find().lean();
        const blogs = await blogModel.find().lean();
        return res.render('admin', { 
            partialContent: 'blog',
            message: 'Tạo bài viết thành công',
            categories,
            blogs,
            error: null,
            blogToEdit: {}
        });
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        const categories = await categoryModel.find().lean();
        const blogs = await blogModel.find().lean();
        return res.render('admin', { 
            partialContent: 'blog',
            error: 'Lỗi server',
            categories,
            blogs,
            message: null,
            blogToEdit: {}
        });
    }
};

// Chi tiết bài viết
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const blog = await blogModel.findById(req.params.id).populate('category').lean();
        if (!blog) {
            return res.render('blogDetail', { error: 'Không tìm thấy bài viết', blog: null });
        }
        // Xử lý nội dung để thay \r\n hoặc \n thành <br> để xuống dòng
        if (blog.content) {
            blog.content = blog.content.replace(/\r\n|\n|\r/g, '<br>');
        }
        res.render('blogDetail', { blog, error: null });
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        res.render('blogDetail', { error: 'Lỗi server', blog: null });
    }
};

export const deleteBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBlog = await blogModel.findByIdAndDelete(id);
        if (!deletedBlog) {
            const categories = await categoryModel.find().lean();
            const blogs = await blogModel.find().lean();
            return res.render('admin', {
                partialContent: 'blog',
                error: 'Không tìm thấy bài viết',
                categories,
                blogs,
                blogToEdit: {}
            });
        }
        if (deletedBlog.image) {
            const imagePath = path.join(__dirname, '..', '..', 'public', 'Uploads', deletedBlog.image);
            try {
                // Kiểm tra file tồn tại trước khi xóa
                await fs.promises.access(imagePath, fs.constants.F_OK);
                await fs.promises.unlink(imagePath);
            } catch (err) {
                console.error('Lỗi khi xóa ảnh hoặc file không tồn tại:', err);
                // Tiếp tục nếu file không tồn tại
            }
        }
        return res.redirect('/admin/blog?message=Xóa bài viết thành công');
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        const categories = await categoryModel.find().lean();
        const blogs = await blogModel.find().lean();
        return res.render('admin', {
            partialContent: 'blog',
            error: 'Lỗi server khi xóa bài viết',
            categories,
            blogs,
            message: null,
            blogToEdit: {}
        });
    }
};
export const AllBlog = async (req: Request, res: Response) => {
  const categoryName = typeof req.query.category === 'string' ? req.query.category : undefined;
  const searchQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = 2;

  try {
    // Lấy tất cả danh mục và thêm thuộc tính isActive
    const categories = await categoryModel.find().lean();
    const categoriesWithActive = categories.map(cat => ({
      ...cat,
      isActive: categoryName === cat.CategoryName
    }));

    // Xây dựng query cho MongoDB
    const query: any = {};
    let categoryId: Types.ObjectId | undefined;

    // Tìm categoryId dựa trên categoryName
    if (categoryName) {
      const categoryDoc = await categoryModel.findOne({ CategoryName: categoryName });
      if (categoryDoc) {
        categoryId = categoryDoc._id as Types.ObjectId;
        query.category = categoryId; // Lọc dựa trên ObjectId
      }
    }

    // Thêm điều kiện tìm kiếm nếu có từ khóa
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Lấy danh sách bài viết
    const blogs = await blogModel
      .find(query)
      .populate('category', 'CategoryName') // Chỉ lấy CategoryName
      .skip((page - 1) * limit)
      .limit(limit);

    // Đếm tổng số bài viết
    const totalBlogs = await blogModel.countDocuments(query);

    // Tạo object pagination
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      hasPrev: page > 1,
      hasNext: page < Math.ceil(totalBlogs / limit),
      prevPage: page - 1,
      nextPage: page + 1,
    };

    res.render('blogs', {
      blogs,
      categories: categoriesWithActive,
      selectedCategory: categoryName,
      pagination,
      searchQuery,
    });
  } catch (error) {
    console.error(error);
    res.render('blogs', {
      blogs: [],
      categories: [],
      selectedCategory: categoryName,
      pagination: null,
      error: 'Đã có lỗi xảy ra khi tải bài viết.',
    });
  }
};

