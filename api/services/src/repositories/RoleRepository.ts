import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class RoleRepository {
  async findById(id: bigint) {
    return prisma.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  async findMany(args?: Prisma.RoleFindManyArgs) {
    return prisma.role.findMany(args);
  }

  async create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.RoleUpdateInput) {
    return prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.role.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.RoleCountArgs) {
    return prisma.role.count(args);
  }
}