import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { label, parentId } = createCategoryDto;

    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${parentId} not found`,
        );
      }
    }

    return this.prisma.category.create({
      data: {
        label,
        parentId,
      },
      include: {
        children: true,
      },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.children.length > 0) {
      for (const child of category.children) {
        await this.remove(child.id);
      }
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getSubtree(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async moveSubtree(id: number, newParentId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (newParentId) {
      const newParent = await this.prisma.category.findUnique({
        where: { id: newParentId },
      });

      if (!newParent) {
        throw new NotFoundException(
          `New parent category with ID ${newParentId} not found`,
        );
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        parentId: newParentId,
      },
      include: {
        children: true,
      },
    });
  }
}
