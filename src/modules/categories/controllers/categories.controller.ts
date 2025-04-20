import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Parent category not found.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = this.categoriesService.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category and its subtree' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    const data = this.categoriesService.remove(+id);
    return {
      message: 'Category deleted successfully',
      data,
    };
  }

  @Get(':id/subtree')
  @ApiOperation({ summary: 'Get a category and its subtree' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'The category subtree has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  getSubtree(@Param('id') id: string) {
    const data = this.categoriesService.getSubtree(+id);
    return {
      message: 'Subtree retrieved successfully',
      data,
    };
  }

  @Put(':id/move/:newParentId')
  @ApiOperation({ summary: 'Move a category to a new parent' })
  @ApiParam({ name: 'id', description: 'Category ID to move' })
  @ApiParam({ name: 'newParentId', description: 'New parent category ID' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully moved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category or new parent not found.',
  })
  moveSubtree(
    @Param('id') id: string,
    @Param('newParentId') newParentId: string,
  ) {
    const data = this.categoriesService.moveSubtree(+id, +newParentId);
    return {
      message: 'Subtree moved successfully',
      data,
    };
  }
}
