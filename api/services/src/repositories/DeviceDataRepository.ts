import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class DeviceDataRepository {
  async findById(id: bigint) {
    return prisma.deviceData.findUnique({
      where: { id },
      include: {
        device: true,
        run: true,
      },
    });
  }

  async findMany(args?: Prisma.DeviceDataFindManyArgs) {
    return prisma.deviceData.findMany(args);
  }

  async create(data: Prisma.DeviceDataCreateInput) {
    return prisma.deviceData.create({
      data,
    });
  }

  async createMany(data: Prisma.DeviceDataCreateManyInput[]) {
    return prisma.deviceData.createMany({
      data,
    });
  }

  async update(id: bigint, data: Prisma.DeviceDataUpdateInput) {
    return prisma.deviceData.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.deviceData.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.DeviceDataCountArgs) {
    return prisma.deviceData.count(args);
  }

  async findByRunId(runId: bigint) {
    return prisma.deviceData.findMany({
      where: { runId },
      orderBy: {
        recordedAt: 'asc',
      },
    });
  }

  async findByDeviceSerial(deviceSerial: string, limit?: number) {
    return prisma.deviceData.findMany({
      where: { deviceSerial },
      orderBy: {
        recordedAt: 'desc',
      },
      take: limit,
    });
  }

  async findLatestByDeviceSerial(deviceSerial: string) {
    return prisma.deviceData.findFirst({
      where: { deviceSerial },
      orderBy: {
        recordedAt: 'desc',
      },
    });
  }

  async findByDeviceSerialInRange(
    deviceSerial: string,
    start: Date,
    end: Date
  ) {
    return prisma.deviceData.findMany({
      where: {
        deviceSerial,
        recordedAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        recordedAt: 'asc',
      },
    });
  }

  async findByRunIdInRange(runId: bigint, start: Date, end: Date) {
    return prisma.deviceData.findMany({
      where: {
        runId,
        recordedAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        recordedAt: 'asc',
      },
    });
  }
}