import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Technology',
  })
  @IsString()
  label: string;

  @ApiPropertyOptional({
    description: 'The ID of the parent category (optional)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
