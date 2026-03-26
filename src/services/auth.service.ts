import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from '@/db';
import type { LoginInput } from '@/schemas/login.schema';
import config from '@/config';

type TokenPayload = {
  userId: string;
};

function isValidTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'userId' in payload &&
    typeof payload.userId === 'string'
  );
}

async function login({ email, password }: LoginInput): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
  };

  const token = sign(tokenPayload, config.auth.secret, {
    expiresIn: config.auth.sessionMaxAge,
  });

  return token;
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = verify(token, config.auth.secret);

    if (!decoded || !isValidTokenPayload(decoded)) {
      return null;
    }

    return decoded;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')
    ) {
      return null;
    }

    if (!config.runtime.isProduction) {
      console.error('Error verifying token:', error);
    }

    return null;
  }
}

export default {
  login,
  verifyToken,
};
