import createDebug from 'debug';
import { Response, NextFunction, Request } from 'express';
import { HTTPError } from '../errors/error.js';
import { Auth, TokenPayload } from '../helpers/auth.js';
import { UsersMongoRepo } from '../repositories/Users/users.mongo.repo.js';

const debug = createDebug('MH:interceptor');

export interface RequestPlus extends Request {
  info?: TokenPayload;
}

export class AuthInterceptor {
  constructor(public repoUsers: UsersMongoRepo) {
    debug('Instantiate');
  }

  logged(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(498, 'Token invalid', 'Not value in auth header');
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Token invalid', 'Not Bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.verifyJWT(token);
      req.info = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  admin(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.info)
        throw new HTTPError(401, 'Not autorithed', 'Not info about user');
      if (req.info.role !== 'admin')
        throw new HTTPError(401, 'Not autorithed', 'Not admin role');
      next();
    } catch (error) {
      next(error);
    }
  }
}
