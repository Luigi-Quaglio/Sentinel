import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class DeviceRepository {
  async findBySerial(serial: string) {
    return prisma.Device.findUnique({
      where: { serial },
    });
  }

  async findMany(args?: Prisma.DeviceFindManyArgs) {
    return prisma.Device.findMany(args);
  }

  async create(data: Prisma.DeviceCreateInput) {
    return prisma.Device.create({
      data,
    });
  }

  async update(serial: string, data: Prisma.DeviceUpdateInput) {
    return prisma.Device.update({
      where: { serial },
      data,
    });
  }

  async delete(serial: string) {
    return prisma.Device.delete({
      where: { serial },
    });
  }

  async count(args?: Prisma.DeviceCountArgs) {
    return prisma.Device.count(args);
  }

  async findActive() {
    return prisma.Device.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
  }
}