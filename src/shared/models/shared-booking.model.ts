import { z } from 'zod'
import { BookingStatus } from '../constants/booking.constant'

export const BookingSchema = z.object({
  id: z.number(),
  guestName: z.string().min(1).max(500),
  guestPhone: z.string().min(1).max(50),
  numberOfGuest: z.number().int().positive(),
  bookingDateTime: z.date(),
  status: z.nativeEnum(BookingStatus),
  note: z.string().default(''),
  userId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Schema for creating a new booking
export const CreateBookingSchema = BookingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  tableIds: z.array(z.number().int().positive('ID bàn không hợp lệ')).min(1, 'Cần chọn ít nhất một bàn'),
  bookingDateTime: z.string().transform((val) => new Date(val)),
  userId: z.number().int().positive().optional()
})

// Schema for updating an existing booking
export const UpdateBookingSchema = CreateBookingSchema.partial().omit({
  userId: true
})

// Types for repository usage
export type CreateBookingType = z.infer<typeof CreateBookingSchema>
export type UpdateBookingType = z.infer<typeof UpdateBookingSchema>

// Schema for paginating bookings
export const BookingPaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  status: z.nativeEnum(BookingStatus).optional(),
  date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  search: z.string().optional()
})

export type BookingPaginationType = z.infer<typeof BookingPaginationSchema>

// Schema for booking with tables
export const BookingWithTablesSchema = BookingSchema.extend({
  tables: z.array(
    z.object({
      id: z.number().int().positive(),
      code: z.string(),
      capacity: z.number().int().positive(),
      location: z.string()
    })
  )
})
