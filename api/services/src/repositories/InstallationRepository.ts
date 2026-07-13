import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class InstallationRepository {
  async findById(id: bigint) {
    return prisma.installation.findUnique({
      where: { id },
      include: {
        unity: true,
        device: true,
      },
    });
  }

  async findMany(args?: Prisma.InstallationFindManyArgs) {
    return prisma.installation.findMany(args);
  }

  async create(data: Prisma.InstallationCreateInput) {
    return prisma.installation.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.InstallationUpdateInput) {
    return prisma.installation.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.installation.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.InstallationCountArgs) {
    return prisma.installation.count(args);
  }

  async findActiveByDeviceSerial(deviceSerial: string) {
    return prisma.installation.findFirst({
      where: {
        deviceSerial,
        status: 'ACTIVE',
        removedAt: null,
      },
      include: {
        unity: true,
        device: true,
      },
    });
  }

  async findActiveByUnityId(unityId: bigint) {
    return prisma.installation.findMany({
      where: {
        unityId,
        status: 'ACTIVE',
        removedAt: null,
      },
      include: {
        device: true,
      },
    });
  }

  async findInstallationHistoryByDeviceSerial(deviceSerial: string) {
    return prisma.installation.findMany({
      where: {
        deviceSerial,
      },
      orderBy: {
        installedAt: 'desc',
      },
      include: {
        unity: true,
      },
    });
  }

  async removeInstallation(
    id: bigint,
    data?: {
      removedAt?: Date;
      notes?: string | null;
      status?: 'REMOVED' | 'INACTIVE';
    }
  ) {
    return prisma.installation.update({
      where: { id },
      data: {
        removedAt: data?.removedAt ?? new Date(),
        status: data?.status ?? 'REMOVED',
        notes: data?.notes,
      },
    });
  }
}