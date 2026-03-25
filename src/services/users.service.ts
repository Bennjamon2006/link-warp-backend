import { hashSync } from 'bcrypt';
import { prisma } from '@/db';
import { CreateUserInput } from '@/schemas/createUser.schema';

async function createUser(data: CreateUserInput) {
  const hashedPassword = hashSync(data.password, 10);

  data.password = hashedPassword;

  const user = await prisma.user.create({
    data,
  });

  return {
    id: user.id,
  };
}

export default {
  createUser,
};
