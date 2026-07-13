import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class AlertRepository {
  async findById(id: bigint) {
    return prisma.alert.findUnique({
      where: { id },
      include: {
        device: true,
        run: true,
        alertType: true,
        acknowledgedByUser: true,
      },
    });
  }

  async findMany(args?: Prisma.AlertFindManyArgs) {
    return prisma.alert.findMany(args);
  }

  async create(data: Prisma.AlertCreateInput) {
    return prisma.alert.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.AlertUpdateInput) {
    return prisma.alert.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.alert.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.AlertCountArgs) {
    return prisma.alert.count(args);
  }

  async findByDeviceSerial(deviceSerial: string) {
    return prisma.alert.findMany({
      where: { deviceSerial },
      orderBy: {
        occurredAt: 'desc',
      },
      include: {
        alertType: true,
        run: true,
      },
    });
  }

  async findByRunId(runId: bigint) {
    return prisma.alert.findMany({
      where: { runId },
      orderBy: {
        occurredAt: 'desc',
      },
      include: {
        alertType: true,
      },
    });
  }

  async findUnacknowledged() {
    return prisma.alert.findMany({
      where: {
        acknowledged: false,
      },
      orderBy: {
        occurredAt: 'desc',
      },
      include: {
        alertType: true,
        device: true,
      },
    });
  }

  async findOpenByDeviceSerial(deviceSerial: string) {
    return prisma.alert.findMany({
      where: {
        deviceSerial,
        resolvedAt: null,
      },
      orderBy: {
        occurredAt: 'desc',
      },
      include: {
        alertType: true,
      },
    });
  }

  async acknowledgeAlert(alertId: bigint, userId: bigint) {
    return prisma.alert.update({
      where: { id: alertId },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedByUser: {
          connect: { id: userId },
        },
      },
    });
  }

  async resolveAlert(alertId: bigint) {
    return prisma.alert.update({
      where: { id: alertId },
      data: {
        resolvedAt: new Date(),
      },
    });
  }
}