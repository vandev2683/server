import { OrderBy, SortBy } from 'src/shared/constants/common.constant'
import { PaginationQuerySchema } from 'src/shared/models/request.model'
import { CategorySchema } from 'src/shared/models/shared-category.model'
import { ProductSchema, ProductVariantsType, VariantSchema } from 'src/shared/models/shared-product.model'
import { TagSchema } from 'src/shared/models/shared-tag.model'
import { z } from 'zod'

function generateVariants(variants: ProductVariantsType) {
  // Hàm hỗ trợ để tạo tất cả tổ hợp
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? ' / ' : ''}${y}`)), [''])
  }

  // Lấy mảng các options từ variants
  const options = variants.map((variant) => variant.options)

  // Tạo tất cả tổ hợp
  const combinations = getCombinations(options)

  // Chuyển tổ hợp thành SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 0,
    thumbnail: null
  }))
}

export const ProductParamsSchema = z.object({
  productId: z.coerce.number().int().positive()
})

export const ProductQuerySchema = PaginationQuerySchema.extend({
  name: z.string().trim().optional(),
  categories: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [Number(value)]
      }
      return value
    }, z.array(z.coerce.number().int().positive()))
    .optional(),
  tags: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [Number(value)]
      }
      return value
    }, z.array(z.coerce.number().int().positive()))
    .optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.Desc),
  sortBy: z.nativeEnum(SortBy).default(SortBy.CreatedAt)
})

export const GetProductsResSchema = z.object({
  data: z.array(ProductSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetAllProductsResSchema = GetProductsResSchema.pick({
  data: true,
  totalItems: true
})

export const GetProductDetailResSchema = ProductSchema.extend({
  variants: z.array(VariantSchema),
  categories: z.array(CategorySchema),
  tags: z.array(TagSchema)
})

export const UpsertVariantBodySchema = VariantSchema.pick({
  value: true,
  price: true,
  stock: true,
  thumbnail: true
})

export const CreateProductBodySchema = ProductSchema.pick({
  name: true,
  description: true,
  images: true,
  status: true,
  variantsConfig: true
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()).optional(),
    tags: z.array(z.coerce.number().int().positive()).optional(),
    variants: z.array(UpsertVariantBodySchema)
  })
  .strict()
  .superRefine(({ variantsConfig, variants }, ctx) => {
    const variantValues = generateVariants(variantsConfig)
    // Kiểm tra xem kích thước của variants có khớp với variantsConfig không
    if (variantValues.length !== variants.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The number of variants (${variants.length}) does not match. Please check again.`,
        path: ['variants']
      })
    }

    // Kiểm tra xem các giá trị của variants có khớp với variantsConfig không
    for (let i = 0; i < variants.length; i++) {
      const isValid = variants[i].value === variantValues[i].value || variants[i].value === 'default'
      if (variants[i].value === 'default') {
        variantsConfig[0].type = 'default'
        variantsConfig[0].options = ['default']
      }
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Variant value "${variants[i].value}" does not match the expected value "${variantValues[i].value}". Please check again.`,
          path: ['variants']
        })
      }
    }
  })

export const UpdateProductBodySchema = CreateProductBodySchema

export type ProductParamsType = z.infer<typeof ProductParamsSchema>
export type ProductQueryType = z.infer<typeof ProductQuerySchema>
export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetAllProductsResType = z.infer<typeof GetAllProductsResSchema>
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>
export type UpsertVariantBodyType = z.infer<typeof UpsertVariantBodySchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
