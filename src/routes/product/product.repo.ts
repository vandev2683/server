import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateProductBodyType, ProductQueryType, UpdateProductBodyType } from './product.model'
import { Prisma } from '@prisma/client'
import { SortBy } from 'src/shared/constants/common.constant'
import { ProductType } from 'src/shared/models/shared-product.model'

@Injectable()
export class ProductRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: ProductQueryType) {
    const { page, limit, orderBy, sortBy, categories, maxPrice, minPrice, name, tags } = query
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {}
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      }
    }
    if (categories && categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: categories
          }
        }
      }
    }
    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          id: {
            in: tags
          }
        }
      }
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            gte: minPrice,
            lte: maxPrice
          }
        }
      }
    } else if (minPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            gte: minPrice
          }
        }
      }
    } else if (maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            lte: maxPrice
          }
        }
      }
    }

    let caculatedOrderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: orderBy
    }
    if (sortBy === SortBy.Price) {
      caculatedOrderBy = {
        basePrice: orderBy
      }
    } else if (sortBy === SortBy.Sale) {
      caculatedOrderBy = {
        orderItems: {
          _count: orderBy
        }
      }
    }
    const [products, totalItems] = await Promise.all([
      this.prismaService.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: caculatedOrderBy
      }),
      this.prismaService.product.count({ where })
    ])

    return {
      data: products,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async findAll() {
    const [products, totalItems] = await Promise.all([
      this.prismaService.product.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      this.prismaService.product.count()
    ])

    return {
      data: products,
      totalItems
    }
  }

  async findById(productId: number) {
    return await this.prismaService.product.findUnique({
      where: { id: productId }
    })
  }

  async findDetail(productId: number) {
    return await this.prismaService.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
        categories: true,
        tags: true
      }
    })
  }

  async create(data: CreateProductBodyType & Pick<ProductType, 'basePrice'>) {
    const { categories, tags, variants, ...productData } = data
    return await this.prismaService.product.create({
      data: {
        ...productData,
        categories: categories
          ? {
              connect: categories.map((id) => ({ id }))
            }
          : undefined,
        tags: tags
          ? {
              connect: tags.map((id) => ({ id }))
            }
          : undefined,
        variants: {
          createMany: {
            data: variants
          }
        }
      }
    })
  }

  async update(productId: number, data: UpdateProductBodyType & Pick<ProductType, 'basePrice'>) {
    const { categories, tags, variants, ...productData } = data
    // Variants đã tồn tại trong DB nhưng không có trong data payload thì sẽ bị xóa
    // Variants đã tồn tại trong DB nhưng có trong data payload thì sẽ được cập nhật
    // Variants không tồn tại trong DB nhưng có trong data payload thì sẽ được thêm mới

    // 1. Lấy Variants trong DB
    const variantsInDb = await this.prismaService.variant.findMany({
      where: {
        productId
      }
    })

    // 2. Tìm các Variants cần xóa
    const variantsToDelete = variantsInDb.filter((variant) => {
      return variants.every((v) => v.value !== variant.value)
    })

    // 3. Mapping các Variants với id
    const variantsWithId = variants.map((variant) => {
      const existingVariant = variantsInDb.find((v) => v.value === variant.value)
      return {
        ...variant,
        id: existingVariant ? existingVariant.id : null
      }
    })

    // 4. Tìm các Variants cần cập nhật
    const variantsToUpdate = variantsWithId.filter((variant) => variant.id !== null)

    // 5. Tìm các Variants cần tạo mới
    const variantsToCreate = variantsWithId
      .filter((variant) => variant.id === null)
      .map((variant) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = variant
        return {
          ...data,
          productId // Tạo liên kết với productId đến product đang cập nhật
        }
      })

    const [product] = await this.prismaService.$transaction([
      this.prismaService.product.update({
        where: { id: productId },
        data: {
          ...productData,
          categories: categories
            ? {
                connect: categories.map((id) => ({ id }))
              }
            : undefined,
          tags: tags
            ? {
                connect: tags.map((id) => ({ id }))
              }
            : undefined
        }
      }),
      this.prismaService.variant.deleteMany({
        where: {
          id: {
            in: variantsToDelete.map((variant) => variant.id)
          }
        }
      }),
      ...variantsToUpdate.map((variant) => {
        return this.prismaService.variant.update({
          where: { id: variant.id as number },
          data: {
            value: variant.value,
            price: variant.price,
            stock: variant.stock,
            thumbnail: variant.thumbnail
          }
        })
      }),
      this.prismaService.variant.createMany({
        data: variantsToCreate
      })
    ])

    return product
  }

  async delete(productId: number) {
    const product = await this.prismaService.$transaction(async (prisma) => {
      await prisma.variant.deleteMany({
        where: { productId }
      })

      return await prisma.product.delete({
        where: { id: productId }
      })
    })
    return product
  }
}
