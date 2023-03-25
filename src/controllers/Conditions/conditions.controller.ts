import { CRepo } from '../../repositories/Conditions/conditions.repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Condition } from '../../entities/condition';
import { HTTPError } from '../../errors/error';

const debug = createDebug('MH:conditions-controller');

export class ConditionsController {
  constructor(public ConditionsMongoRepo: CRepo<Condition>) {
    this.ConditionsMongoRepo = ConditionsMongoRepo;
  }

  async toLoad(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.ConditionsMongoRepo.read();
      resp.json({
        result: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async toLoadID(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.ConditionsMongoRepo.readId(req.params.id);
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

      await this.ConditionsMongoRepo.delete(req.params.id);

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
      const data = await this.ConditionsMongoRepo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
}
