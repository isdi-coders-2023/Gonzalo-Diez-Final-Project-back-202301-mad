import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { User } from '../entities/user.js';
import { HTTPError } from '../errors/error.js';
import { URepo } from '../repositories/Users/users.repo.interface.js';
import { Auth, TokenPayload } from '../helpers/auth.js';
import { RequestPlus } from '../interceptors/auth.interceptor.js';

const debug = createDebug('MH:Controller');

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
        results: [data],
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
        value: req.body.email,
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

      debug(token);

      resp.status(202);
      resp.json({
        results: [token],
      });
    } catch (error) {
      next(error);
    }
  }

  async addAddiction(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const userId = req.info?.id;
      if (typeof userId !== 'string')
        throw new HTTPError(404, 'Not found', 'Token was not found');
      const { addiction } = req.body;
      const { timeConsuming } = req.body;
      const { cause } = req.body;
      const userAddiction = await this.userRepo.addAddiction(
        userId,
        addiction,
        timeConsuming,
        cause
      );

      const updatedUser = await this.userRepo.update(userAddiction);

      resp.status(202);
      resp.json({
        results: [updatedUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddiction(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const userId = req.info?.id;
      const index = parseInt(req.params.index, 10);

      if (typeof userId !== 'string')
        throw new HTTPError(404, 'Not found', 'Token was not found');

      const user = await this.userRepo.deleteAddiction(userId, index);
      const updatedUser = await this.userRepo.update(user);
      resp.status(204);
      resp.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async addCondition(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const userId = req.info?.id;
      if (typeof userId !== 'string')
        throw new HTTPError(404, 'Not found', 'Token was not found');
      const { condition } = req.body;
      const { timeConsuming } = req.body;
      const { cause } = req.body;
      const userCondition = await this.userRepo.addCondition(
        userId,
        condition,
        timeConsuming,
        cause
      );

      const updatedUser = await this.userRepo.update(userCondition);

      resp.status(202);
      resp.json({
        results: [updatedUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCondition(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const userId = req.info?.id;
      const index = parseInt(req.params.index, 10);
      if (typeof userId !== 'string')
        throw new HTTPError(404, 'Not found', 'Token was not found');

      const user = await this.userRepo.deleteCondition(userId, index);
      const updatedUser = await this.userRepo.update(user);
      resp.status(204);
      resp.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.info?.id)
        throw new HTTPError(498, 'Not found', 'Token wasnt found');
      const { id } = req.info;
      const data = await this.userRepo.readId(id);
      resp.status(202);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
