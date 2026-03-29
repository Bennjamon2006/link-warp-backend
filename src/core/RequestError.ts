import config from '@/config';

export default class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }

  public static isRequestError(error: unknown): error is RequestError {
    return error instanceof RequestError;
  }

  public static fromError(error: unknown) {
    if (error instanceof RequestError) {
      return error;
    }

    if (error instanceof Error) {
      return new RequestError(
        config.runtime.isProduction
          ? 'An internal server error occurred'
          : error.message,
        500,
        'INTERNAL_SERVER_ERROR',
        config.runtime.isProduction ? undefined : { stack: error.stack }
      );
    }

    return new RequestError('An unknown error occurred', 500, 'UNKNOWN_ERROR');
  }

  public static badRequest(message: string, details?: unknown) {
    return new RequestError(message, 400, 'BAD_REQUEST', details);
  }

  public static unauthorized(message: string) {
    return new RequestError(message, 401, 'UNAUTHORIZED');
  }

  public static forbidden(message: string) {
    return new RequestError(message, 403, 'FORBIDDEN');
  }

  public static notFound(message: string) {
    return new RequestError(message, 404, 'NOT_FOUND');
  }

  public static conflict(message: string) {
    return new RequestError(message, 409, 'CONFLICT');
  }

  public static internal(message: string, details?: unknown) {
    return new RequestError(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}
