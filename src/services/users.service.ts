import { hashSync } from 'bcrypt';
import { prisma } from '@/db';
import { CreateUserInput } from '@/schemas/createUser.schema';
import isUniqueError from '@/helpers/isUniqueError';
import RequestError from '@/core/RequestError';

async function createUser(data: CreateUserInput) {
  const hashedPassword = hashSync(data.password, 10);

  data.password = hashedPassword;

  try {
    const user = await prisma.user.create({
      data,
    });

    return {
      id: user.id,
    };
  } catch (error) {
    if (isUniqueError(error)) {
      throw RequestError.conflict('Email already exists');
    }

    throw error;
  }
}

async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export default {
  createUser,
  getUserById,
};
