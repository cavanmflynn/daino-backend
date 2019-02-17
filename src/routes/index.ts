import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../logger';
import { PingRoute } from './ping';
import { BaseRoute } from './route';
import { UserRoute } from './user';

/**
 * / route
 *
 * @class ApiRoutes
 */
export class ApiRoutes extends BaseRoute {
  public static path = '/api';
  private static instance: ApiRoutes;

  /**
   * @class ApiRoutes
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.init();
  }

  /**
   * @class ApiRoute
   * @method getRouter
   * @returns {Router}
   */
  static get router(): Router {
    if (!ApiRoutes.instance) {
      ApiRoutes.instance = new ApiRoutes();
    }
    return ApiRoutes.instance.router;
  }

  /**
   * @class ApiRoute
   * @method init
   */
  private init() {
    logger.info('[ApiRoute] Creating api routes.');

    this.router.get('/', this.get);
    this.router.use(PingRoute.path, PingRoute.router);
    this.router.use(UserRoute.path, UserRoute.router);
  }

  /**
   * @class ApiRoute
   * @method index
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ ok: true });
  }
}
