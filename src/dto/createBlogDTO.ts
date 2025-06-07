// dto/createBlogDTO.js
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class BlogDTO {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsString()
    @IsNotEmpty()
    category!: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsBoolean()
    @IsOptional()
    featured?: boolean;
}