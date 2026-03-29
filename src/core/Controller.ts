/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import CustomResponse from './Response';

type RouteMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

type GenericRequest = Request<any, any, any>;
type GenericResponse = Response<any, any>;

type LegacyHandler = (
  req: GenericRequest,
  res: GenericResponse,
  next: NextFunction
) => void | GenericResponse | Promise<void | GenericResponse>;

type CustomHandler = (
  req: GenericRequest
) => Promise<CustomResponse<any>> | CustomResponse<any>;

type Handler = LegacyHandler | CustomHandler;

type RouteDefinition = {
  method: RouteMethod;
  path: string;
  handler: Handler;
  middlewares: RequestHandler[];
};

export default abstract class Controller {
  private routes: RouteDefinition[] = [];

  private addRoute(method: RouteMethod, path: string, ...handlers: Handler[]) {
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

  protected get(path: string, ...handlers: Handler[]) {
    this.addRoute('get', path, ...handlers);
  }

  protected post(path: string, ...handlers: Handler[]) {
    this.addRoute('post', path, ...handlers);
  }

  protected put(path: string, ...handlers: Handler[]) {
    this.addRoute('put', path, ...handlers);
  }

  protected delete(path: string, ...handlers: Handler[]) {
    this.addRoute('delete', path, ...handlers);
  }

  protected patch(path: string, ...handlers: Handler[]) {
    this.addRoute('patch', path, ...handlers);
  }

  public registerRoutes(router: Router) {
    this.routes.forEach(({ method, path, handler, middlewares }) => {
      router[method](
        path,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const bindedHandler = handler.bind(this);
            const result = await bindedHandler(req, res, next);

            if (result instanceof CustomResponse) {
              result.send(res);
            }
          } catch (error) {
            next(error);
          }
        }
      );
    });
  }
}
