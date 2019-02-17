import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import {
  UserController as User,
  WalletController as Wallet,
} from '../../controller';
import { logger } from '../../logger';
import { Github, Twitter } from '../../services';
import { Website } from '../../types';
import { HdWallet } from '../../utils';
import { BaseRoute } from '../route';

export class UserRoute extends BaseRoute {
  public static path = '/user';
  private static instance: UserRoute;
  private websites = [Website.TWITTER, Website.GITHUB];

  constructor() {
    super();
    this.init();
  }

  static get router() {
    if (!UserRoute.instance) {
      UserRoute.instance = new UserRoute();
    }
    return UserRoute.instance.router;
  }

  private init() {
    logger.info('[UserRoute] Creating user route.');
    this.router.post(
      '/createOrFindWithUsername',
      check(['website', 'username']).exists(),
      check('website').isIn(this.websites),
      this.createOrFindWithUsername,
    );
    this.router.post(
      '/createOrFindWithToken',
      check(['token', 'website']).exists(),
      check('website').isIn(this.websites),
      this.createOrFindWithToken,
    );
  }

  /**
   * Create a new user if they do not yet exist in the database, otherwise, return the user record.
   * This method will create the user with hasLoggedIn set to false
   */
  private async createOrFindWithUsername(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
        `[UserRoute] /createOrFindWithUsername validation error: ${errors.array()}.`,
      );
      res.status(400).json({ error: errors.array() });
      return;
    }

    try {
      const { website, username } = req.body;
      let user = await User.get(website, username);
      if (!user || !user.hasLoggedIn) {
        // User does not exist, derive a new address
        const index = await Wallet.incrementIndexAndReturnPrevious();
        const address = HdWallet.getAddressAtIndex(index);
        user = {
          index,
          address,
          username,
          balance: 0,
          hasLoggedIn: false,
        };
      }
      await User.set(website, username, user);
      res.json({ user });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  /**
   * Create a new user if they do not yet exist in the database, otherwise, return the user record
   * This method will create the user with hasLoggedIn set to true
   */
  private async createOrFindWithToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
        `[UserRoute] /createOrFindWithToken validation error: ${errors.array()}.`,
      );
      res.status(400).json({ error: errors.array() });
      return;
    }

    try {
      const { token, secret, website } = req.body;
      let username: string;
      switch (website) {
        case Website.TWITTER:
          username = (await Twitter.client(token, secret).get(
            'account/verify_credentials.json',
            {},
          )).screen_name;
          break;
        case Website.GITHUB:
          username = await Github.client(token).getUsernameWithAccessToken();
          break;
      }

      let user = await User.get(website, username);
      if (!user || !user.hasLoggedIn) {
        // User does not exist, derive a new address
        const index = await Wallet.incrementIndexAndReturnPrevious();
        const address = HdWallet.getAddressAtIndex(index);
        user = {
          index,
          address,
          username,
          balance: 0,
          hasLoggedIn: true,
        };
      }
      await User.set(website, username, user);
      res.json({ user });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }
}
