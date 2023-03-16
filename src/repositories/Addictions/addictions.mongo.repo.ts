import { ARepo } from './addictions.repo.interface';
import { UserAddiction } from '../../entities/addiction';
import createDebug from 'debug';
import { HTTPError } from '../../errors/error';
import { AddictionModel } from './addictions.mongo.model';

const debug = createDebug('MH:mongo:AddictionsRepo');

export class AddictionsMongoRepo implements ARepo<UserAddiction> {
  private static instance: AddictionsMongoRepo;

  public static getInstance(): AddictionsMongoRepo {
    if (!AddictionsMongoRepo.instance)
      AddictionsMongoRepo.instance = new AddictionsMongoRepo();

    return AddictionsMongoRepo.instance;
  }

  async read(): Promise<UserAddiction[]> {
    debug('read-method');
    const data = await AddictionModel.find().exec();
    return data as unknown as UserAddiction[];
  }

  async readId(id: string): Promise<UserAddiction> {
    debug('readID-method');
    const data = await AddictionModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');
    return data as unknown as UserAddiction;
  }

  async update(addiction: Partial<UserAddiction>): Promise<UserAddiction> {
    debug('update-method');
    const data = await AddictionModel.findByIdAndUpdate(
      addiction.id,
      addiction,
      {
        new: true,
      }
    ).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data as unknown as UserAddiction;
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
