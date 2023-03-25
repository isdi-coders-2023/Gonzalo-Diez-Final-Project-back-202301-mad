import { ConditionModel } from './conditions.mongo.model';
import { Condition } from '../../entities/condition';
import { ConditionsMongoRepo } from './conditions.mongo.repo';

jest.mock('./Conditions.mongo.model.js');

describe('Given the repository ConditionsMongoRepo', () => {
  const repo = ConditionsMongoRepo.getInstance();

  const mockPopulateFunction = (mockPopulateValue: unknown) => ({
    exec: jest.fn().mockResolvedValue(mockPopulateValue),
  });

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of ConditionsMongoRepo', () => {
      expect(repo).toBeInstanceOf(ConditionsMongoRepo);
    });
  });

  describe('When the read method is used', () => {
    test('Then it should return the mock result of the Conditions', async () => {
      const mockPopulateValue = [{ id: '1' }, { id: '2' }];

      (ConditionModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.read();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When the readId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { id: '1' };

      (ConditionModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.readId('1');
      expect(ConditionModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (ConditionModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.readId('')).rejects.toThrow();
    });
  });

  describe('When the update method is used', () => {
    const mockCondition = {
      name: 'test',
    } as Partial<Condition>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { name: 'test' };

      (ConditionModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.update(mockCondition);
      expect(result).toEqual({ name: 'test' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (ConditionModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.update(mockCondition)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      const mockPopulateValue = {};
      (ConditionModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      await repo.delete('1');
      expect(ConditionModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (ConditionModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      expect(async () => repo.delete('')).rejects.toThrow();
    });
  });
});
