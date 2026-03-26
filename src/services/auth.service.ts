import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/db';
import { LoginInput } from '@/schemas/login.schema';
import config from '@/config';

async function login({ email, password }: LoginInput): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = compareSync(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: '7d',
  });

  return token;
}

export default {
  login,
};
