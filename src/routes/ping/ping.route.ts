import { NextFunction, Request, Response } from 'express';
import { logger } from '../../logger';
import { BaseRoute } from '../route';

/**
 * @api {get} /ping Ping Request
 * @apiName Ping
 * @apiGroup Ping
 *
 * @apiSuccess {String}
 */
export class PingRoute extends BaseRoute {
  public static path = '/ping';
  private static instance: PingRoute;

  /**
   * @class PingRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.init();
  }

  static get router() {
    if (!PingRoute.instance) {
      PingRoute.instance = new PingRoute();
    }
    return PingRoute.instance.router;
  }

  private init() {
    logger.info('[PingRoute] Creating ping route.');
    this.router.get('/', this.get);
  }

  /**
   * @class PingRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    res.json('pong');
    next();
  }
}
