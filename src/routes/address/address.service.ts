import { Injectable, NotFoundException } from '@nestjs/common'
import { AddressRepo } from './address.repo'
import { CreateAddressBodyType, UpdateAddressBodyType } from './address.model'

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepo) {}

  private async verifyAddressExists(addressId: number) {
    const address = await this.addressRepo.findById(addressId)
    if (!address) {
      throw new NotFoundException('Address not found')
    }
    return address
  }

  private async verifyLocationExists({
    provinceId,
    districtId,
    wardId
  }: {
    provinceId: number
    districtId: number
    wardId: number
  }) {
    const location = await this.addressRepo.findLocationByIds({ provinceId, districtId, wardId })
    if (!location.district || !location.province || !location.ward) {
      throw new NotFoundException('Location not found')
    }
  }

  async findAll(userId: number) {
    return this.addressRepo.findAll(userId)
  }

  async findDetailById(addressId: number) {
    const address = await this.addressRepo.findDetailById(addressId)
    if (!address) {
      throw new NotFoundException('Address not found')
    }
    return address
  }

  async create(userId: number, data: CreateAddressBodyType) {
    await this.verifyLocationExists({
      provinceId: data.provinceId,
      districtId: data.districtId,
      wardId: data.wardId
    })
    return await this.addressRepo.create(userId, data)
  }

  async update(addressId: number, data: UpdateAddressBodyType) {
    await this.verifyAddressExists(addressId)
    await this.verifyLocationExists({
      provinceId: data.provinceId,
      districtId: data.districtId,
      wardId: data.wardId
    })
    return await this.addressRepo.update(addressId, data)
  }

  async delete(addressId: number) {
    await this.verifyAddressExists(addressId)
    await this.addressRepo.delete(addressId)
    return { message: 'Address deleted successfully' }
  }
}
