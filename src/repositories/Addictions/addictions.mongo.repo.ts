import { ARepo } from './addictions.repo.interface.js';
import { Addiction } from '../../entities/addiction.js';
import createDebug from 'debug';
import { HTTPError } from '../../errors/error.js';
import { AddictionModel } from './addictions.mongo.model.js';

const debug = createDebug('MH:mongo:AddictionsRepo');

export class AddictionsMongoRepo implements ARepo<Addiction> {
  private static instance: AddictionsMongoRepo;

  public static getInstance(): AddictionsMongoRepo {
    if (!AddictionsMongoRepo.instance)
      AddictionsMongoRepo.instance = new AddictionsMongoRepo();

    return AddictionsMongoRepo.instance;
  }

  async read(): Promise<Addiction[]> {
    debug('read-method');
    const data = await AddictionModel.find().exec();
    return data as unknown as Addiction[];
  }

  async readId(id: string): Promise<Addiction> {
    debug('readID-method');
    const data = await AddictionModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');
    return data as unknown as Addiction;
  }

  async update(addiction: Partial<Addiction>): Promise<Addiction> {
    debug('update-method');
    const data = await AddictionModel.findByIdAndUpdate(
      addiction.id,
      addiction,
      {
        new: true,
      }
    ).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data as unknown as Addiction;
  }

  async delete(id: string): Promise<void> {
    debug('delete-method');
    const data = await AddictionModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found'
      );
  }
}
