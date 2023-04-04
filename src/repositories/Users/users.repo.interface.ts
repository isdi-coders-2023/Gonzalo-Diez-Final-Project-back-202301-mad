import { Addiction } from '../../entities/addiction';
import { Condition } from '../../entities/condition';
import { User } from '../../entities/user';

export interface URepo<T> {
  readId(id: string): Promise<T>;
  create(info: Partial<T>): Promise<T>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  addAddiction(
    userId: string,
    addictionId: Addiction['id'],
    timeConsuming: Date,
    cause: string
  ): Promise<User>;
  deleteAddiction(userId: string, index: number): Promise<User>;
  update(info: Partial<T>): Promise<T>;
  addCondition(
    userId: string,
    conditionId: Condition['id'],
    timeConsuming: Date,
    cause: string
  ): Promise<User>;
  deleteCondition(userId: string, index: number): Promise<User>;
}
