import { UsersMongoRepo } from './users.mongo.repo.js';
import { UserModel } from './user.mongo.model.js';

jest.mock('./user.mongo.model.js');

describe('Given Users Mongo Repo', () => {
  const instance = UsersMongoRepo.getInstance();
  describe('When we try to manually instanciate the repo', () => {
    test('Then the Users Mongo Repo should be instanciated', () => {
      expect(instance).toBeInstanceOf(UsersMongoRepo);
    });
  });
  describe('When we use the create method ', () => {
    test('Then it should return the new data', async () => {
      const mock = { id: '2' };
      (UserModel.create as jest.Mock).mockResolvedValue(mock);
      const result = await instance.create(mock);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result.id).toBe('2');
    });
  });
  describe('When the search method is used', () => {
    test('Then, it should return the searched data', async () => {
      const mock = { id: '2' };
      (UserModel.find as jest.Mock).mockResolvedValue(mock);
      const result = await instance.search({
        key: 'some',
        value: 'xd',
      });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe('When the readId method is used', () => {
    const mockPopulateFunction = (mockPopulateValue: unknown) => ({
      exec: jest.fn().mockResolvedValue(mockPopulateValue),
    });
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { id: '1' };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await instance.readId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => instance.readId('')).rejects.toThrow();
    });
  });
});
