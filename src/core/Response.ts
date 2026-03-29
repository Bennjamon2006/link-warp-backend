import type { Response as ExpressResponse } from 'express';

type CookieOptions = {
  path?: string;
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

type CookieData = {
  value: string;
  options: CookieOptions;
};

export default class Response<T> {
  private cookies: Record<string, CookieData> = {};

  constructor(
    public readonly data: T,
    public readonly status: number,
    public readonly headers: Record<string, string>
  ) {}

  public setCookie(name: string, value: string, options: CookieOptions = {}) {
    this.cookies[name] = { value, options };

    return this;
  }

  public send(res: ExpressResponse) {
    res.status(this.status).set(this.headers);

    Object.entries(this.cookies).forEach(([name, value]) => {
      res.cookie(name, value.value, value.options);
    });

    if (this.data !== null && this.status !== 204) {
      res.json(this.data);
    } else {
      res.send();
    }
  }

  public static ok<T>(
    data: T,
    headers: Record<string, string> = {}
  ): Response<T> {
    return new Response<T>(data, 200, headers);
  }

  public static created<T>(
    data: T,
    headers: Record<string, string> = {}
  ): Response<T> {
    return new Response<T>(data, 201, headers);
  }

  public static noContent(
    headers: Record<string, string> = {}
  ): Response<null> {
    return new Response<null>(null, 204, headers);
  }
}
