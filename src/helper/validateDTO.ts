// helper/validateDTO.js
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Response } from 'express';
import blogModel from '../module/blogModel';
import categoryModel from '../module/categoryModel';

export async function validateDTO<T extends object>(
  dtoClass: new () => T,
  data: any,
  res: Response,
  partialContent: string,
): Promise<T | void> {
  // Kiểm tra dtoClass
  if (!dtoClass || typeof dtoClass !== 'function') {
    console.error('Invalid dtoClass:', dtoClass);
    return res.render('admin', { 
      partialContent,
      error: 'Lỗi: Invalid DTO class',
      categories: [],
      blogs: [],
      message: null,
      blogToEdit: {}
    });
  }

  // Kiểm tra data
  if (!data || typeof data !== 'object') {
    console.error('Invalid data:', data);
    return res.render('admin', { 
      partialContent,
      error: 'Lỗi: Dữ liệu không hợp lệ',
      categories: [],
      blogs: [],
      message: null,
      blogToEdit: {}
    });
  }

  // Chuyển đổi dữ liệu trước khi tạo DTO instance
  const normalizedData = {
    ...data,
    featured: data.featured === 'true' || data.featured === true // Chuyển chuỗi 'true' thành boolean
  };

  // Convert plain object to DTO instance
  const dtoInstance = plainToClass(dtoClass, normalizedData);
  console.log('dtoInstance:', dtoInstance); // Log để debug

  // Kiểm tra dtoInstance
  if (!dtoInstance) {
    console.error('Failed to create DTO instance:', normalizedData);
    return res.render('admin', { 
      partialContent,
      error: 'Lỗi: Không thể tạo DTO instance',
      categories: [],
      blogs: [],
      message: null,
      blogToEdit: {}
    });
  }

  // Validate data
  const errors: ValidationError[] = await validate(dtoInstance);
  console.log('errors:', errors); // Log để debug

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => {
        if (err.constraints) {
          return Object.values(err.constraints);
        }
        return [err.toString()];
      })
      .flat()
      .join(', ');
    
    // Lấy danh sách danh mục và bài viết để hiển thị lại form
    const categories = await categoryModel.find().lean();
    const blogs = await blogModel.find().lean();

    return res.render('admin', { 
      partialContent: 'blog', // Luôn render partial blog
      error: `Lỗi: ${errorMessages}`,
      categories,
      blogs,
      message: null,
      blogToEdit: {}
    });
  }

  return dtoInstance;
}