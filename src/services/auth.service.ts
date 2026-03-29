import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from '@/db';
import type { LoginInput } from '@/schemas/login.schema';
import config from '@/config';
import RequestError from '@/core/RequestError';

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
    throw RequestError.unauthorized('Invalid credentials');
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw RequestError.unauthorized('Invalid credentials');
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
  };

  const token = sign(tokenPayload, config.auth.secret, {
    expiresIn: config.auth.sessionMaxAge,
  });

  return token;
}

async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const decoded = verify(token, config.auth.secret);

    if (!decoded || !isValidTokenPayload(decoded)) {
      throw RequestError.unauthorized('Invalid token');
    }

    return decoded;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')
    ) {
      throw RequestError.unauthorized('Invalid token');
    }

    throw error;
  }
}

export default {
  login,
  verifyToken,
};
