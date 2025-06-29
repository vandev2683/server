import { Prisma } from '@prisma/client'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}
export function isUniquePrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export const generateRandomFilename = (filename: string) => {
  const ext = extname(filename)
  return `${uuidv4()}${ext}`
}
