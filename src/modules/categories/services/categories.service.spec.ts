/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category without parent', async () => {
      const createCategoryDto = { label: 'Test Category' };
      const expectedCategory = {
        id: 1,
        label: 'Test Category',
        parentId: null,
      };

      mockPrismaService.category.create.mockResolvedValue(expectedCategory);

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(expectedCategory);
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryDto,
        include: { children: true },
      });
    });

    it('should create a category with parent', async () => {
      const createCategoryDto = { label: 'Test Category', parentId: 1 };
      const expectedCategory = { id: 2, label: 'Test Category', parentId: 1 };
      const parentCategory = { id: 1, label: 'Parent Category' };

      mockPrismaService.category.findUnique.mockResolvedValue(parentCategory);
      mockPrismaService.category.create.mockResolvedValue(expectedCategory);

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(expectedCategory);
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryDto,
        include: { children: true },
      });
    });

    it('should throw NotFoundException when parent not found', async () => {
      const createCategoryDto = { label: 'Test Category', parentId: 999 };
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.create(createCategoryDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category without children', async () => {
      const categoryId = 1;
      const category = { id: categoryId, children: [] };

      mockPrismaService.category.findUnique.mockResolvedValue(category);
      mockPrismaService.category.delete.mockResolvedValue(category);

      const result = await service.remove(categoryId);
      expect(result).toEqual(category);
      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = 999;
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.remove(categoryId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getSubtree', () => {
    it('should return a category with its subtree', async () => {
      const categoryId = 1;
      const category = {
        id: categoryId,
        label: 'Test Category',
        children: [
          {
            id: 2,
            label: 'Child Category',
            children: [],
          },
        ],
      };

      mockPrismaService.category.findUnique.mockResolvedValue(category);

      const result = await service.getSubtree(categoryId);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = 999;
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.getSubtree(categoryId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('moveSubtree', () => {
    it('should move a category to a new parent', async () => {
      const categoryId = 1;
      const newParentId = 2;
      const category = { id: categoryId, label: 'Test Category' };
      const newParent = { id: newParentId, label: 'New Parent' };
      const updatedCategory = { ...category, parentId: newParentId };

      mockPrismaService.category.findUnique
        .mockResolvedValueOnce(category)
        .mockResolvedValueOnce(newParent);
      mockPrismaService.category.update.mockResolvedValue(updatedCategory);

      const result = await service.moveSubtree(categoryId, newParentId);
      expect(result).toEqual(updatedCategory);
      expect(mockPrismaService.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: { parentId: newParentId },
        include: { children: true },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      const categoryId = 999;
      const newParentId = 2;
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.moveSubtree(categoryId, newParentId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when new parent not found', async () => {
      const categoryId = 1;
      const newParentId = 999;
      const category = { id: categoryId, label: 'Test Category' };

      mockPrismaService.category.findUnique
        .mockResolvedValueOnce(category)
        .mockResolvedValueOnce(null);

      await expect(
        service.moveSubtree(categoryId, newParentId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
