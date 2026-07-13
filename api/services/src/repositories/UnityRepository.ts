import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class UnityRepository {
  async findById(id: bigint) {
    return prisma.unity.findUnique({
      where: { id },
    });
  }

  async findMany(args?: Prisma.UnityFindManyArgs) {
    return prisma.unity.findMany(args);
  }

  async create(data: Prisma.UnityCreateInput) {
    return prisma.unity.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.UnityUpdateInput) {
    return prisma.unity.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.unity.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.UnityCountArgs) {
    return prisma.unity.count(args);
  }

  async findByCompanyAndCode(companyId: bigint, code: string) {
    return prisma.unity.findFirst({
      where: {
        companyId,
        code,
      },
    });
  }
}