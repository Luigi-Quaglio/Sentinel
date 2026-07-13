import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class UserRepository {
  async findById(id: bigint) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findMany(args?: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(args);
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.UserCountArgs) {
    return prisma.user.count(args);
  }
}