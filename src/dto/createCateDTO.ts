import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class categoryDTO {
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MaxLength(50, { message: 'Tên danh mục không được vượt quá 50 ký tự' })
  @Matches(/^[A-Z][a-z]*$/, {
    message:
      'Tên danh mục phải bắt đầu bằng chữ hoa và các chữ cái còn lại viết thường (ví dụ: Technology)',
  })
  CategoryName!: string;
}
