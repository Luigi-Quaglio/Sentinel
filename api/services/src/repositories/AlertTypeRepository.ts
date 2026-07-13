import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class AlertTypeRepository {
  async findById(id: bigint) {
    return prisma.alertType.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string) {
    return prisma.alertType.findUnique({
      where: { code },
    });
  }

  async findMany(args?: Prisma.AlertTypeFindManyArgs) {
    return prisma.alertType.findMany(args);
  }

  async create(data: Prisma.AlertTypeCreateInput) {
    return prisma.alertType.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.AlertTypeUpdateInput) {
    return prisma.alertType.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.alertType.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.AlertTypeCountArgs) {
    return prisma.alertType.count(args);
  }

  async findActive() {
    return prisma.alertType.findMany({
      where: {
        active: true,
      },
    });
  }
}