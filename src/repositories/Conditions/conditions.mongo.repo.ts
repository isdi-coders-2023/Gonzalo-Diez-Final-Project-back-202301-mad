import { CRepo } from './conditions.repo.interface';
import { Condition } from '../../entities/condition';
import createDebug from 'debug';
import { HTTPError } from '../../errors/error.js';
import { ConditionModel } from './conditions.mongo.model.js';

const debug = createDebug('MH:mongo:ConditionsRepo');

export class ConditionsMongoRepo implements CRepo<Condition> {
  private static instance: ConditionsMongoRepo;

  public static getInstance(): ConditionsMongoRepo {
    if (!ConditionsMongoRepo.instance)
      ConditionsMongoRepo.instance = new ConditionsMongoRepo();

    return ConditionsMongoRepo.instance;
  }

  async read(): Promise<Condition[]> {
    debug('read-method');
    const data = await ConditionModel.find().exec();
    return data as unknown as Condition[];
  }

  async readId(id: string): Promise<Condition> {
    debug('readID-method');
    const data = await ConditionModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');
    return data as unknown as Condition;
  }

  async update(addiction: Partial<Condition>): Promise<Condition> {
    debug('update-method');
    const data = await ConditionModel.findByIdAndUpdate(
      addiction.id,
      addiction,
      {
        new: true,
      }
    ).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data as unknown as Condition;
  }

  async delete(id: string): Promise<void> {
    debug('delete-method');
    const data = await ConditionModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found'
      );
  }
}
