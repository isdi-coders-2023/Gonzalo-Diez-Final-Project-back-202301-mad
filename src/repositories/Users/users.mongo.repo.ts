import { URepo } from './users.repo.interface';
import { User } from '../../entities/user';
import createDebug from 'debug';
import { UserModel } from './user.mongo.model';
const debug = createDebug('users:mongo:Repo');

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
    return data;
  }
}
