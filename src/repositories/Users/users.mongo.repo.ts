import { URepo } from './users.repo.interface';
import { User, UserAddiction, UserCondition } from '../../entities/user.js';
import createDebug from 'debug';
import { UserModel } from './user.mongo.model.js';
import { HTTPError } from '../../errors/error.js';
import { Addiction } from '../../entities/addiction';
import { Condition } from '../../entities/condition';
const debug = createDebug('MH:mongo:Repo');

export class UsersMongoRepo implements URepo<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance)
      UsersMongoRepo.instance = new UsersMongoRepo();

    return UsersMongoRepo.instance;
  }

  async readId(id: string): Promise<User> {
    debug('read ID');
    const data = await UserModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found');
    return data;
  }

  async create(user: Partial<User>): Promise<User> {
    debug('create-method');
    const data = await UserModel.create(user);
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search-method');
    const data = await UserModel.find({ [query.key]: query.value })
      .populate('addictions')
      .exec();
    return data;
  }

  async addAddiction(
    userId: string,
    addictionId: Addiction['id'],
    timeConsuming: Date,
    cause: string
  ): Promise<User> {
    const user = await UserModel.findById(userId).exec();
    if (!user)
      throw new HTTPError(404, 'Not found', 'User not found in addAddiction');

    const userAddiction: UserAddiction = {
      addictionId,
      timeConsuming,
      cause,
    };

    if (!user.addictions)
      throw new HTTPError(404, 'Not found', 'Addiction not found or undefined');

    user.addictions.push(userAddiction);

    return user;
  }

  async deleteAddiction(userId: string, index: number): Promise<User> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw new HTTPError(
        404,
        'Not found',
        'User not found in deleteAddiction'
      );
    }

    if (!user.addictions)
      throw new HTTPError(404, 'Not found', 'Addiction not found or undefined');

    if (
      user.addictions.length === 0 ||
      index < 0 ||
      index > user.addictions.length
    ) {
      throw new HTTPError(404, 'Not found', 'Addiction not found or undefined');
    }

    user.addictions.splice(index, 1);
    return user;
  }

  async update(user: Partial<User>): Promise<User> {
    debug('update-method');
    const data = await UserModel.findByIdAndUpdate(user.id, user, {
      new: true,
    }).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async addCondition(
    userId: string,
    conditionId: Condition['id'],
    timeConsuming: Date,
    cause: string
  ): Promise<User> {
    const user = await UserModel.findById(userId).exec();
    if (!user)
      throw new HTTPError(404, 'Not found', 'User not found in addCondition');

    const userConditon: UserCondition = {
      conditionId,
      timeConsuming,
      cause,
    };

    if (!user.conditions)
      throw new HTTPError(404, 'Not found', 'Condition not found or undefined');

    user.conditions.push(userConditon);

    return user;
  }

  async deleteCondition(userId: string, index: number): Promise<User> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw new HTTPError(
        404,
        'Not found',
        'User not found in deleteCondition'
      );
    }

    if (!user.conditions)
      throw new HTTPError(404, 'Not found', 'Addiction not found or undefined');

    if (
      user.conditions.length === 0 ||
      index < 0 ||
      index > user.conditions.length
    ) {
      throw new HTTPError(404, 'Not found', 'Addiction not found or undefined');
    }

    user.conditions.splice(index, 1);
    return user;
  }
}
