import { ARepo } from '../../repositories/Addictions/addictions.repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UserAddiction } from '../../entities/user';
import { HTTPError } from '../../errors/error';
import { URepo } from '../../repositories/Users/users.repo.interface';
import { User } from '../../entities/user';

const debug = createDebug('MH:addictions-controller');

export class AddictionsController {
  constructor(
    public AddictionsRepo: ARepo<UserAddiction>,
    public userRepo: URepo<User>
  ) {
    this.AddictionsRepo = AddictionsRepo;
    this.userRepo = userRepo;
  }

  async toLoad(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.AddictionsRepo.read();
      resp.json({
        result: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async toLoadID(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.AddictionsRepo.readId(req.params.id);
      if (data) {
        resp.json({
          result: data,
        });
      } else {
        resp.status(404).json({ message: 'ID not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  async toDelete(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Params ID was not found');

      await this.AddictionsRepo.delete(req.params.id);

      resp.json({
        result: [],
      });
    } catch (error) {
      next(error);
    }
  }

  async toEdit(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Params ID was not found');
      req.body.id = req.params.id;
      const data = await this.AddictionsRepo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
