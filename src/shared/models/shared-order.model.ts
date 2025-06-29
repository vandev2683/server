import { z } from 'zod'
import { PaymentMethod, PaymentStatus, OrderStatus, OrderType } from '../constants/order.constant'

export const PaymentSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.Pending),
  paidAt: z.date().nullable().default(null),
  transactionId: z.string().trim().default('')
})

export type PaymentType = z.infer<typeof PaymentSchema>

// Order item schema for creating orders
export const OrderItemInputSchema = z.object({
  variantId: z.number().int().positive(),
  quantity: z.number().int().positive()
})

// Base schema for order data
export const OrderSchema = z.object({
  id: z.number(),
  orderType: z.nativeEnum(OrderType),
  customerName: z.string().max(500).default(''),
  userId: z.number().nullable(),
  deliveryAddressId: z.number().nullable(),
  tableId: z.number().nullable(),
  bookingId: z.number().nullable(),
  couponId: z.number().nullable(),
  totalAmount: z.number().positive(),
  discountAmount: z.number().nonnegative().default(0),
  finalAmount: z.number().positive(),
  payment: PaymentSchema,
  note: z.string().default(''),
  status: z.nativeEnum(OrderStatus),
  handlerId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Order item schema
export const OrderItemSchema = z.object({
  id: z.number().int().positive(),
  productName: z.string().min(1).max(500),
  thumbnail: z.string().min(1),
  variantAttributes: z.array(
    z.object({
      name: z.string(),
      value: z.string()
    })
  ),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  orderId: z.number().int().positive(),
  productId: z.number().int().positive().optional().nullable(),
  variantId: z.number().int().positive().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Schema for creating a new order with delivery
export const CreateDeliveryOrderSchema = z.object({
  orderType: z.literal(OrderType.Delivery),
  customerName: z.string().min(1).max(500),
  deliveryAddressId: z.number().int().positive(),
  items: z.array(OrderItemInputSchema).min(1, 'Đơn hàng phải có ít nhất một sản phẩm'),
  couponCode: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  note: z.string().optional().default('')
})

// Schema for creating a new order for dine-in
export const CreateDineInOrderSchema = z.object({
  orderType: z.literal(OrderType.DineIn),
  customerName: z.string().min(1).max(500),
  tableId: z.number().int().positive(),
  bookingId: z.number().int().positive().optional(),
  items: z.array(OrderItemInputSchema).min(1, 'Đơn hàng phải có ít nhất một sản phẩm'),
  couponCode: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  note: z.string().optional().default('')
})

// Combined schema for creating any type of order
export const CreateOrderSchema = z.discriminatedUnion('orderType', [CreateDeliveryOrderSchema, CreateDineInOrderSchema])

// Schema for updating an order's status
export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
})

// Schema for updating payment status
export const UpdatePaymentStatusSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus),
  transactionId: z.string().optional(),
  paidAmount: z.number().positive().optional()
})

// Types for repository and service usage
export type CreateOrderType = z.infer<typeof CreateOrderSchema>
export type UpdateOrderStatusType = z.infer<typeof UpdateOrderStatusSchema>
export type UpdatePaymentStatusType = z.infer<typeof UpdatePaymentStatusSchema>

// Schema for paginating orders
export const OrderPaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  status: z.nativeEnum(OrderStatus).optional(),
  orderType: z.nativeEnum(OrderType).optional(),
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  search: z.string().optional(),
  userId: z.number().int().positive().optional()
})

export type OrderPaginationType = z.infer<typeof OrderPaginationSchema>

// Extended schemas for responses
export const OrderWithItemsSchema = OrderSchema.extend({
  orderItems: z.array(OrderItemSchema),
  user: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
      email: z.string(),
      phoneNumber: z.string()
    })
    .optional()
    .nullable(),
  deliveryAddress: z
    .object({
      id: z.number().int().positive(),
      recipientName: z.string(),
      recipientPhone: z.string(),
      detailAddress: z.string(),
      province: z.object({
        id: z.number().int().positive(),
        name: z.string()
      }),
      district: z.object({
        id: z.number().int().positive(),
        name: z.string()
      }),
      ward: z.object({
        id: z.number().int().positive(),
        name: z.string()
      })
    })
    .optional()
    .nullable(),
  table: z
    .object({
      id: z.number().int().positive(),
      code: z.string(),
      capacity: z.number().int().positive(),
      location: z.string()
    })
    .optional()
    .nullable(),
  booking: z
    .object({
      id: z.number().int().positive(),
      guestName: z.string(),
      guestPhone: z.string(),
      bookingDateTime: z.date()
    })
    .optional()
    .nullable(),
  coupon: z
    .object({
      id: z.number().int().positive(),
      code: z.string(),
      discountValue: z.number().positive()
    })
    .optional()
    .nullable(),
  handler: z
    .object({
      id: z.number().int().positive(),
      name: z.string()
    })
    .optional()
    .nullable()
})
