import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreateAddressBodyType, UpdateAddressBodyType } from './address.model'

@Injectable()
export class AddressRepo {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(userId: number) {
    const addresses = await this.prismaService.address.findMany({
      where: {
        userId
      },
      include: {
        province: true,
        district: true,
        ward: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      data: addresses,
      totalItems: addresses.length
    }
  }

  async findById(addressId: number) {
    return await this.prismaService.address.findUnique({
      where: { id: addressId }
    })
  }

  async findDetailById(addressId: number) {
    return await this.prismaService.address.findUnique({
      where: { id: addressId },
      include: {
        province: true,
        district: true,
        ward: true
      }
    })
  }

  async findLocationByIds({
    provinceId,
    districtId,
    wardId
  }: {
    provinceId: number
    districtId: number
    wardId: number
  }) {
    const [province, district, ward] = await Promise.all([
      this.prismaService.province.findUnique({ where: { id: provinceId } }),
      this.prismaService.district.findUnique({ where: { id: districtId } }),
      this.prismaService.ward.findUnique({ where: { id: wardId } })
    ])

    return { province, district, ward }
  }

  async create(userId: number, data: CreateAddressBodyType) {
    return await this.prismaService.address.create({
      data: {
        ...data,
        userId
      }
    })
  }

  async update(addressId: number, data: UpdateAddressBodyType) {
    return await this.prismaService.address.update({
      where: {
        id: addressId
      },
      data
    })
  }

  async delete(addressId: number) {
    return await this.prismaService.address.delete({
      where: { id: addressId }
    })
  }
}
