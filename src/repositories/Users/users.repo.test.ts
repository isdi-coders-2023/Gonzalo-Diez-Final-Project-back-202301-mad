import { UsersMongoRepo } from './users.mongo.repo.js';
import { UserModel } from './user.mongo.model.js';
import { User } from '../../entities/user.js';
import { HTTPError } from '../../errors/error.js';

jest.mock('./user.mongo.model.js');

describe('Given Users Mongo Repo', () => {
  const instance = UsersMongoRepo.getInstance();

  const mockPopulateFunction = (mockPopulateValue: unknown) => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockPopulateValue),
    })),
  });

  const mockExecFunction = (mockPopulateValue: unknown) => ({
    exec: jest.fn().mockResolvedValue(mockPopulateValue),
  });

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
      const mockPopulateValue = [{ id: '1' }];

      (UserModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const mockQuery = { key: 'test', value: 'test' };
      const result = await instance.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });
  describe('when we call the readId', () => {
    test('then it should return the mockvalue', async () => {
      const mockPopulateValue = { id: '2' };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockPopulateValue)
      );
      const result = await instance.readId('2');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '2' });
    });
    test('then if there NO DATA it should throw error', async () => {
      const mockPopulateValue = null;
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockPopulateValue)
      );
      expect(async () => instance.readId('')).rejects.toThrow();
    });
  });
  describe('When the addAddiction method is used', () => {
    test('If there is no errors, it should add a new addiction to the user and return it', async () => {
      const mockUser = {
        id: '1',
        addictions: [],
      };

      const mockUserAddiction = {
        addictionId: '1',
        timeConsuming: new Date('2019-07-11'),
        cause: 'stress',
      };

      const expectedUser = {
        id: '1',
        addictions: [mockUserAddiction],
      };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockUser)
      );

      const result = await instance.addAddiction(
        '1',
        '1',
        new Date('2019-07-11'),
        'stress'
      );
      expect(UserModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedUser);
      expect(mockUser.addictions).toContainEqual(mockUserAddiction);
    });

    test('If the user does not exist, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(null)
      );
      await expect(
        instance.addAddiction('1', '1', new Date('2019-07-11'), 'stress')
      ).rejects.toThrow();
    });

    test('If the user addictions are not defined, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction({ id: '1' })
      );
      await expect(
        instance.addAddiction('1', '1', new Date('2019-07-11'), 'stress')
      ).rejects.toThrow();
    });
  });
  describe('Whe we use the deleteAddiction method', () => {
    test('Then, it should return the array with no length', async () => {
      const mockUser = {
        id: '1',
        addictions: ['1', '2', '3'],
      };
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockUser)
      );

      await instance.deleteAddiction(mockUser.id, 0);
      expect(UserModel.findById).toHaveBeenCalled();
      expect(mockUser.addictions.length).toBe(2);
    });
    test('If the user does not exist, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(null)
      );
      await expect(instance.deleteAddiction('1', 2)).rejects.toThrow();
    });
    test('If the user addictions are not defined, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction({ id: '1' })
      );
      await expect(instance.deleteAddiction('1', 1)).rejects.toThrow();
    });
    test('If the user addictions array length its 0, it should throw an error', async () => {
      const mockUser = {
        id: '1',
        addictions: [],
      };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockUser)
      );

      await expect(instance.deleteAddiction(mockUser.id, 0)).rejects.toThrow();
    });
  });
  describe('When we use the update method', () => {
    test('Then it should return the user updated', async () => {
      const mock = { id: '2' };
      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockExecFunction(mock)
      );
      const result = await instance.update(mock);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result.id).toBe('2');
    });
    test('Then it should return an error', async () => {
      const mockUser = { id: '3' } as Partial<User>;
      const mockPopulateValue = null;
      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockPopulateValue)
      );
      await expect(instance.update(mockUser)).rejects.toThrow(HTTPError);
      await expect(instance.update(mockUser)).rejects.toHaveProperty(
        'statusCode',
        404
      );
    });
  });
  describe('When the AddCondition method is used', () => {
    test('If there is no errors, it should add the new condition to the user', async () => {
      const mockUser = {
        id: '1',
        conditions: [],
      };

      const mockConditionUser = {
        conditionId: '1',
        timeConsuming: new Date('2019-07-11'),
        cause: 'work',
      };

      const expectedUser = {
        id: '1',
        conditions: [mockConditionUser],
      };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockUser)
      );

      const result = await instance.addCondition(
        '1',
        '1',
        new Date('2019-07-11'),
        'work'
      );

      expect(UserModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedUser);
      expect(mockUser.conditions).toContainEqual(mockConditionUser);
    });
    test('If the user does not exist, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(null)
      );
      await expect(
        instance.addCondition('1', '1', new Date('2019-07-11'), 'stress')
      ).rejects.toThrow();
    });

    test('If the user conditions are not defined, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction({ id: '1' })
      );
      await expect(
        instance.addCondition('1', '1', new Date('2019-07-11'), 'stress')
      ).rejects.toThrow();
    });
  });
  describe('Whe we use the deleteCondition method', () => {
    test('Then, it should return the array with no length', async () => {
      const mockUser = {
        id: '1',
        conditions: ['1', '2', '3'],
      };
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockUser)
      );

      await instance.deleteCondition(mockUser.id, 0);
      expect(UserModel.findById).toHaveBeenCalled();
      expect(mockUser.conditions.length).toBe(2);
    });
    test('If the user does not exist, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(null)
      );
      await expect(instance.deleteCondition('1', 2)).rejects.toThrow();
    });
    test('If the user conditions are not defined, it should throw a 404 error', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction({ id: '1' })
      );
      await expect(instance.deleteCondition('1', 1)).rejects.toThrow();
    });
    test('If the user conditions array length its 0, it should throw an error', async () => {
      const mockUser = {
        id: '1',
        conditions: [],
      };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockExecFunction(mockUser)
      );

      await expect(instance.deleteCondition(mockUser.id, 0)).rejects.toThrow();
    });
  });
});
