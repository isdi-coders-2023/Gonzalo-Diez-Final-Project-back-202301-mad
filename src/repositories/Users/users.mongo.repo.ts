import { URepo } from './users.repo.interface';
import { User } from '../../entities/user.js';
import createDebug from 'debug';
import { UserModel } from './user.mongo.model.js';
import { HTTPError } from '../../errors/error.js';
const debug = createDebug('MH:mongo:Repo');

export class UsersMongoRepo implements URepo<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance)
      UsersMongoRepo.instance = new UsersMongoRepo();

    return UsersMongoRepo.instance;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('toCreate');
    const data = await UserModel.create(info);
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [query.key]: query.value });
    debug(data);
    return data;
  }

  async readId(id: string): Promise<User> {
    debug('readID-method');
    const data = await UserModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');
    return data;
  }
}
