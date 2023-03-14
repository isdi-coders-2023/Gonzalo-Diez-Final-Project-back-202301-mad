import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user';
import { HTTPError } from '../errors/error';
import { URepo } from '../repositories/Users/users.repo.interface';
import { Auth } from '../helpers/auth';
import { TokenPayload } from '../helpers/auth';

const debug = createDebug('Users:Controller');

export class UserController {
  constructor(public userRepo: URepo<User>) {
    this.userRepo = userRepo;
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('POST: register');

      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid user or password');

      req.body.password = await Auth.toHash(req.body.password);

      const data = await this.userRepo.create(req.body);

      resp.status(201);
      resp.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('POST: LogIn');

      const data = await this.userRepo.search({
        key: 'email',
        value: 'req.body.email',
      });

      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email or Password not found');

      if (!(await Auth.toUnHash(req.body.password, data[0].password)))
        throw new HTTPError(
          401,
          'Unauthorized',
          'Wrong Password trying to log in'
        );

      const payload: TokenPayload = {
        id: data[0].id,
        email: data[0].email,
      };

      const token = Auth.createJWT(payload);

      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
