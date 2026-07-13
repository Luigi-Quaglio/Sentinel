import { Prisma } from '@prisma/client';
import prisma from '../prismaClient';

export class CompanyRepository {
  async findById(id: bigint) {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  async findMany(args?: Prisma.CompanyFindManyArgs) {
    return prisma.company.findMany(args);
  }

  async create(data: Prisma.CompanyCreateInput) {
    return prisma.company.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.CompanyUpdateInput) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return prisma.company.delete({
      where: { id },
    });
  }

  async count(args?: Prisma.CompanyCountArgs) {
    return prisma.company.count(args);
  }

  async findByDocument(document: string) {
    return prisma.company.findFirst({
      where: { document },
    });
  }

  async findActive() {
    return prisma.company.findMany({
      where: { active: true },
    });
  }
}