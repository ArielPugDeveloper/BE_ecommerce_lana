import { PrismaClient } from '@prisma/client';
import { user } from '../../domain/entities/user.js';

const prisma = new PrismaClient();

export const userRepository = {
  async findByEmail(email) {
    const userData = await prisma.user.findUnique({
      where: { email },
    });
    return userData ? new user(userData) : null;
  },

  async findById(id) {
    const userData = await prisma.user.findUnique({
      where: { id },
    });
    return userData ? new user(userData) : null;
  },

  async create(userData) {
    const newUser = await prisma.user.create({ data: userData });
    return new user(newUser);
  },

    async findAll() {
    const usersData = await prisma.user.findMany();
    return usersData.map(data => new user(data));
  },
};