import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class UserUnityRepository {
  async findById(id: bigint) {
    return prisma.userUnity.findUnique({
      where: { id },
      include: {
        user: true,
        unity: true,
        role: true,
      },
    });
  }

  async findMany(args?: Prisma.UserUnityFindManyArgs) {
    return prisma.userUnity.findMany(args);
  }

  async create(data: Prisma.UserUnityCreateInput) {
    return prisma.userUnity.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.UserUnityUpdateInput) {
    return prisma.userUnity.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.userUnity.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.UserUnityCountArgs) {
    return prisma.userUnity.count(args);
  }

  async findByUserAndUnity(userId: bigint, unityId: bigint) {
    return prisma.userUnity.findUnique({
        where: {
        userId_unityId: {
            userId,
            unityId,
        },
        },
        include: {
        role: true,
        },
    });
  }      

  async findByUserId(userId: bigint) {
    return prisma.userUnity.findMany({
      where: { userId },
      include: {
        unity: true,
        role: true,
      },
    });
  }

  async findByUnityId(unityId: bigint) {
    return prisma.userUnity.findMany({
      where: { unityId },
      include: {
        user: true,
        role: true,
      },
    });
  }

  async findActiveByUserId(userId: bigint) {
    return prisma.userUnity.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        unity: true,
        role: true,
      },
    });
  }
}