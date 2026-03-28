import type {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';

type RouteMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

type RouteDefinition = {
  method: RouteMethod;
  path: string;
  handler: RequestHandler;
  middlewares: RequestHandler[];
};

export default abstract class Controller {
  private routes: RouteDefinition[] = [];

  private addRoute(
    method: RouteMethod,
    path: string,
    ...handlers: RequestHandler[]
  ) {
    const handler = handlers.pop();
    const middlewares = handlers;

    if (!method || !path || !handler) {
      throw new Error(
        'Method, path, and handler are required to define a route'
      );
    }

    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    this.routes.push({ method, path, handler, middlewares });
  }

  protected get(path: string, ...handlers: RequestHandler[]) {
    this.addRoute('get', path, ...handlers);
  }

  protected post(path: string, ...handlers: RequestHandler[]) {
    this.addRoute('post', path, ...handlers);
  }

  protected put(path: string, ...handlers: RequestHandler[]) {
    this.addRoute('put', path, ...handlers);
  }

  protected delete(path: string, ...handlers: RequestHandler[]) {
    this.addRoute('delete', path, ...handlers);
  }

  protected patch(path: string, ...handlers: RequestHandler[]) {
    this.addRoute('patch', path, ...handlers);
  }

  public registerRoutes(router: Router) {
    this.routes.forEach(({ method, path, handler, middlewares }) => {
      router[method](
        path,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            await handler.call(this, req, res, next);
          } catch (error) {
            next(error);
          }
        }
      );
    });
  }
}
