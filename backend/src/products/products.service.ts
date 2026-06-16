import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, search?: string) {
    const where: any = {};

    if (category) {
      // Since categories is a String[] array in Postgres
      where.categories = {
        has: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Ürün bulunamadı.');
    }
    return product;
  }

  async create(createProductDto: any) {
    return this.prisma.product.create({
      data: {
        id: createProductDto.id,
        name: createProductDto.name,
        description: createProductDto.description,
        price: Number(createProductDto.price),
        originalPrice: createProductDto.originalPrice ? Number(createProductDto.originalPrice) : null,
        image: createProductDto.image,
        images: createProductDto.images || [],
        colors: createProductDto.colors || [],
        variants: createProductDto.variants || [],
        categories: createProductDto.categories || [],
        isNew: createProductDto.isNew ?? false,
        isBestseller: createProductDto.isBestseller ?? false,
      },
    });
  }

  async update(id: string, updateProductDto: any) {
    await this.findOne(id); // Throws 404 if not found
    
    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price !== undefined ? Number(updateProductDto.price) : undefined,
        originalPrice: updateProductDto.originalPrice !== undefined 
          ? (updateProductDto.originalPrice ? Number(updateProductDto.originalPrice) : null) 
          : undefined,
        image: updateProductDto.image,
        images: updateProductDto.images,
        colors: updateProductDto.colors,
        variants: updateProductDto.variants,
        categories: updateProductDto.categories,
        isNew: updateProductDto.isNew,
        isBestseller: updateProductDto.isBestseller,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Throws 404 if not found
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
