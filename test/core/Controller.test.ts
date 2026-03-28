import { describe, it, expect, vi } from 'vitest';
import { Router } from 'express';
import Controller from '@/core/Controller';
import mockRouter from '../mocks/router.mock';

describe('Controller', () => {
  it('should add routes correctly', () => {
    class TestController extends Controller {
      constructor() {
        super();
        this.get('/test', (req, res) => res.send('GET test'));
        this.post('/test', (req, res) => res.send('POST test'));
      }
    }

    const controller = new TestController();
    const router = mockRouter();

    controller.registerRoutes(router as unknown as Router);

    expect(router.get).toHaveBeenCalledWith('/test', expect.any(Function));
    expect(router.post).toHaveBeenCalledWith('/test', expect.any(Function));
  });

  it('should throw error if method, path, or handler is missing', () => {
    class InvalidController extends Controller {
      constructor() {
        super();
        this.get('/invalid'); // Missing handler
      }
    }

    expect(() => new InvalidController()).toThrow(
      'Method, path, and handler are required to define a route'
    );
  });

  it('should throw error if handler is not a function', () => {
    class InvalidController extends Controller {
      constructor() {
        super();

        // @ts-expect-error - Intentionally passing a non-function handler
        this.get('/invalid', 'not a function');
      }
    }

    expect(() => new InvalidController()).toThrow('Handler must be a function');
  });

  it('should pass middlewares and handler to the router', () => {
    const middleware1 = vi.fn((req, res, next) => next());
    const middleware2 = vi.fn((req, res, next) => next());
    const handler = vi.fn((req, res) => res.send('Handler called'));

    class TestController extends Controller {
      constructor() {
        super();
        this.get('/test', middleware1, middleware2, handler);
      }
    }

    const controller = new TestController();
    const router = mockRouter();

    controller.registerRoutes(router as unknown as Router);

    expect(router.get).toHaveBeenCalledWith(
      '/test',
      middleware1,
      middleware2,
      expect.any(Function)
    );
  });

  it('should call next with error if handler throws', async () => {
    const error = new Error('Test error');

    class TestController extends Controller {
      constructor() {
        super();
        this.get('/test', () => {
          throw error;
        });
      }
    }

    const controller = new TestController();
    const router = mockRouter();
    const next = vi.fn();

    controller.registerRoutes(router as unknown as Router);

    const routeHandler = router.get.mock.calls[0][1];
    await routeHandler({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next with error if handler rejects', async () => {
    const error = new Error('Async test error');

    class TestController extends Controller {
      constructor() {
        super();
        this.get('/test', async () => {
          throw error;
        });
      }
    }

    const controller = new TestController();
    const router = mockRouter();
    const next = vi.fn();

    controller.registerRoutes(router as unknown as Router);

    const routeHandler = router.get.mock.calls[0][1];
    await routeHandler({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should bind the correct context to handler', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = vi.fn(function (this: any, req, res) {
      res.send(this.value);
    });

    class TestController extends Controller {
      value = 'test value';

      constructor() {
        super();
        this.get('/test', handler);
      }
    }

    const controller = new TestController();
    const router = mockRouter();

    controller.registerRoutes(router as unknown as Router);

    const routeHandler = router.get.mock.calls[0][1];
    const res = { send: vi.fn() };
    const next = vi.fn();

    await routeHandler({}, res, next);

    expect(handler).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith('test value');
    expect(next).not.toHaveBeenCalled();
  });
});
