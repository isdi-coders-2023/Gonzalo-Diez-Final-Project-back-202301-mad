import { AddictionsMongoRepo } from './addictions.mongo.repo';
import { AddictionModel } from './addictions.mongo.model';
import { Addiction } from '../../entities/addiction';

jest.mock('./addictions.mongo.model.js');

describe('Given the repository AddictionsMongoRepo', () => {
  const repo = AddictionsMongoRepo.getInstance();

  const mockPopulateFunction = (mockPopulateValue: unknown) => ({
    exec: jest.fn().mockResolvedValue(mockPopulateValue),
  });

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of AddictionsMongoRepo', () => {
      expect(repo).toBeInstanceOf(AddictionsMongoRepo);
    });
  });

  describe('When the read method is used', () => {
    test('Then it should return the mock result of the addictions', async () => {
      const mockPopulateValue = [{ id: '1' }, { id: '2' }];

      (AddictionModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.read();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When the readId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { id: '1' };

      (AddictionModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.readId('1');
      expect(AddictionModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (AddictionModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.readId('')).rejects.toThrow();
    });
  });

  describe('When the update method is used', () => {
    const mockAddiction = {
      name: 'test',
    } as Partial<Addiction>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { brand: 'test' };

      (AddictionModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.update(mockAddiction);
      expect(result).toEqual({ brand: 'test' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (AddictionModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.update(mockAddiction)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      const mockPopulateValue = {};
      (AddictionModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      await repo.delete('1');
      expect(AddictionModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (AddictionModel.findByIdAndDelete as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );
      expect(async () => repo.delete('')).rejects.toThrow();
    });
  });
});
