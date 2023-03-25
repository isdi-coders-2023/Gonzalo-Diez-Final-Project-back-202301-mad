import { Request, Response } from 'express';
import { ConditionsController } from './conditions.controller';
import { ConditionsMongoRepo } from '../../repositories/Conditions/conditions.mongo.repo';
import { UsersMongoRepo } from '../../repositories/Users/users.mongo.repo';

describe('Given Addictions controller', () => {
  const repo: ConditionsMongoRepo = {
    read: jest.fn(),
    readId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;

  const resp = {
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  const controller = new ConditionsController(repo);

  describe('When toLoad method is called', () => {
    test('Then, it should return the data if there isnt any problem', async () => {
      await controller.toLoad(req, resp, next);
      expect(repo.read).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is any error it should call next', async () => {
      (repo.read as jest.Mock).mockRejectedValue(new Error());
      await controller.toLoad(req, resp, next);
      expect(repo.read).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When toLoadID method is called', () => {
    test('Then it should call the repo method', async () => {
      await controller.toLoadID(req, resp, next);
      expect(repo.readId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is any error it should call next', async () => {
      (repo.readId as jest.Mock).mockResolvedValue(new Error());
      await controller.toLoadID(req, resp, next);
      expect(repo.readId);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When delete method is called', () => {
    test('Then, it should work if there is no errors', async () => {
      const req = {
        params: {
          id: '1',
        },
      } as unknown as Request;

      await controller.toDelete(req, resp, next);
      expect(repo.delete).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is any error it should call next function', async () => {
      const req = {
        params: {
          id: undefined,
        },
      } as unknown as Request;

      await controller.toDelete(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('Given the toEdit method', () => {
    const req = {
      body: {
        id: '1',
      },
      params: {
        id: '1',
      },
    } as unknown as Request;
    test('Then, if everythings its Ok it should call the repo method', async () => {
      await controller.toEdit(req, resp, next);
      expect(repo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is any error it should call next', async () => {
      const req = {
        params: {
          id: undefined,
        },
      } as unknown as Request;
      (repo.update as jest.Mock).mockResolvedValue(new Error());
      await controller.toEdit(req, resp, next);
      expect(repo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
