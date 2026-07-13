import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class RunRepository {
  async findById(id: bigint) {
    return prisma.run.findUnique({
      where: { id },
      include: {
        device: true,
        alerts: true,
      },
    });
  }

  async findMany(args?: Prisma.RunFindManyArgs) {
    return prisma.run.findMany(args);
  }

  async create(data: Prisma.RunCreateInput) {
    return prisma.run.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.RunUpdateInput) {
    return prisma.run.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.run.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.RunCountArgs) {
    return prisma.run.count(args);
  }

  async findRunningByDeviceSerial(deviceSerial: string) {
    return prisma.run.findFirst({
      where: {
        deviceSerial,
        status: 'RUNNING',
        endedAt: null,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findLatestByDeviceSerial(deviceSerial: string) {
    return prisma.run.findFirst({
      where: {
        deviceSerial,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findManyByDeviceSerial(deviceSerial: string) {
    return prisma.run.findMany({
      where: {
        deviceSerial,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async finishRun(
    id: bigint,
    data?: {
      endedAt?: Date;
      status?: 'COMPLETED' | 'FAILED' | 'CANCELLED';
      notes?: string | null;
      maxTemperature?: Prisma.Decimal | number | null;
      minTemperature?: Prisma.Decimal | number | null;
    }
  ) {
    return prisma.run.update({
      where: { id },
      data: {
        endedAt: data?.endedAt ?? new Date(),
        status: data?.status ?? 'COMPLETED',
        notes: data?.notes,
        maxTemperature: data?.maxTemperature,
        minTemperature: data?.minTemperature,
      },
    });
  }
}