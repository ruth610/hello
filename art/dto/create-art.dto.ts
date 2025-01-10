import { IsString, IsNumber, IsNotEmpty,IsEnum, Min } from 'class-validator';
import { ArtCategory } from '../entities/art.entity';
export class CreateArtDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  imageUrl: string;
  @IsEnum(ArtCategory)
  category: ArtCategory;
  
}