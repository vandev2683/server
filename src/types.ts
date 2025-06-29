/* eslint-disable @typescript-eslint/no-namespace */
import { PaymentType } from './shared/models/shared-order.model'
import { ProductVariantsType } from './shared/models/shared-product.model'

declare global {
  namespace PrismaJson {
    type ProductVariants = ProductVariantsType
    type Payment = PaymentType
  }
}
