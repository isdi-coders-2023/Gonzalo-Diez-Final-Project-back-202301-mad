import { UserController } from './users.controller';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { URepo } from '../repositories/Users/users.repo.interface';
import { Auth } from '../helpers/auth';
import { RequestPlus } from '../interceptors/auth.interceptor';

jest.mock('../helpers/auth');

describe('Given the user controller', () => {
  const mockPassword = 'test';

  const repoMock = {
    create: jest.fn(),
    search: jest.fn(),
    addAddiction: jest.fn(),
    deleteAddiction: jest.fn(),
    readId: jest.fn(),
  } as unknown as URepo<User>;

  const controller = new UserController(repoMock);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the register method is called', () => {
    test('Then, if everything is correct, the response should be ok', async () => {
      const req = {
        body: {
          email: 'thisIsATest@test.com',
          password: mockPassword,
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(repoMock.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
  test('When the email or password are wrong, it should call the next function', async () => {
    const req = {
      body: {
        password: mockPassword,
      },
    } as unknown as Request;

    await controller.register(req, resp, next);
    expect(next).toHaveBeenCalled();
  });

  describe('When the LogIn method is called', () => {
    test('Then, if all its correct, it should return the data', async () => {
      const req = {
        body: {
          email: 'thisIsATest@test.com',
          password: mockPassword,
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      (repoMock.search as jest.Mock).mockReturnValue(['Test']);
      Auth.toUnHash = jest.fn().mockResolvedValue(true);

      expect(repoMock.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
    });
    test('Then, if there is no email, it should return next function', async () => {
      const req = {
        body: {
          password: mockPassword,
        },
      } as unknown as Request;
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then, if there is no password, it should return the next function', async () => {
      const req = {
        body: {
          email: 'ThisIsAtest@test.com',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then, if you give the search method empty, it should call next function', async () => {
      const req = {
        body: {
          email: 'ThisIsATest@test.com',
          password: mockPassword,
        },
      } as unknown as Request;
      (repoMock.search as jest.Mock).mockReturnValue([]);
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if you give the incorrect password, the Auth method gives false as return', async () => {
      const req = {
        body: {
          email: 'ThisIsATest@test.com',
          password: mockPassword,
        },
      } as unknown as Request;

      (repoMock.search as jest.Mock).mockReturnValue(['test']);
      Auth.toUnHash = jest.fn().mockResolvedValue(false);
      await controller.login(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use the addAddiction method', () => {
    test('Then, it should return user addiction data when successfully added', async () => {
      const userId = '1';
      const addiction = 'Alcohol';
      const timeConsuming = 2;
      const cause = 'Social pressure';

      const req = {
        info: { id: userId },
        body: { addiction, timeConsuming, cause },
      } as RequestPlus;

      const userAddiction = { id: 1, userId, addiction, timeConsuming, cause };
      const addAddictionMock = jest.fn().mockResolvedValue(userAddiction);
      const updateMock = jest.fn().mockResolvedValue(userAddiction);

      repoMock.addAddiction = addAddictionMock;
      repoMock.update = updateMock;

      const resp = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.addAddiction(req, resp, next);

      expect(addAddictionMock).toHaveBeenCalledWith(
        userId,
        addiction,
        timeConsuming,
        cause
      );
      expect(updateMock).toHaveBeenCalledWith(userAddiction);
      expect(resp.status).toHaveBeenCalledWith(202);
      expect(resp.json).toHaveBeenCalledWith({ results: [userAddiction] });
    });

    test('Then, if there is any error it should call Next function', async () => {
      const userId = '1';
      const addiction = 'Alcohol';
      const timeConsuming = 2;
      const cause = 2;

      const req = {
        params: { userId },
        body: { addiction, timeConsuming, cause },
      } as unknown as Request;

      await controller.addAddiction(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use the deleteAddictionController method', () => {
    test('Then, it should call the repo method, and should return the resp', async () => {
      const userMock = {
        id: '1',
        Addictions: ['1'],
      };

      const req = {
        params: {
          userId: '1',
          index: 0,
        },
        info: { id: '1' },
      } as unknown as RequestPlus;

      repoMock.deleteAddiction = jest.fn().mockResolvedValue(userMock);

      await controller.deleteAddiction(req, resp, next);
      expect(repoMock.update).toHaveBeenCalled();
      expect(repoMock.deleteAddiction).toHaveBeenCalledWith('1', 0);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is any error, it should call next', async () => {
      const userMock = {
        id: '1',
        Addictions: [],
      };

      const req = {
        params: {
          userId: userMock,
          index: 4,
        },
      } as unknown as Request;

      await controller.deleteAddiction(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use the addCondition function', () => {
    test('Then, it give back user condition that is  successfully added to the user', async () => {
      const userId = '1';
      const condition = 'depression';
      const timeConsuming = 2;
      const cause = 'Social pressure';

      const req = {
        info: { id: userId },
        body: { condition, timeConsuming, cause },
      } as RequestPlus;

      const userCondition = { id: 1, userId, condition, timeConsuming, cause };
      const addConditionMock = jest.fn().mockResolvedValue(userCondition);
      const updateMock = jest.fn().mockResolvedValue(userCondition);

      repoMock.addCondition = addConditionMock;
      repoMock.update = updateMock;

      const resp = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await controller.addCondition(req, resp, next);

      expect(addConditionMock).toHaveBeenCalledWith(
        userId,
        condition,
        timeConsuming,
        cause
      );
      expect(updateMock).toHaveBeenCalledWith(userCondition);
      expect(resp.status).toHaveBeenCalledWith(202);
      expect(resp.json).toHaveBeenCalledWith({ results: [userCondition] });
    });

    test('Then, if there is any error it should call Next function', async () => {
      const userId = '1';
      const condition = 'depression';
      const timeConsuming = 2;
      const cause = 2;

      const req = {
        params: { userId },
        body: { condition, timeConsuming, cause },
      } as unknown as Request;

      await controller.addCondition(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we call the deleteCondition function', () => {
    test('Then, it should use the repo method, and it should make the resp', async () => {
      const userMock = {
        id: '1',
        conditions: ['1'],
      };

      const req = {
        params: {
          userId: '1',
          index: 0,
        },
        info: { id: '1' },
      } as unknown as RequestPlus;

      repoMock.deleteCondition = jest.fn().mockResolvedValue(userMock);

      await controller.deleteCondition(req, resp, next);
      expect(repoMock.update).toHaveBeenCalled();
      expect(repoMock.deleteCondition).toHaveBeenCalledWith('1', 0);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is any error, it should call next', async () => {
      const userMock = {
        id: '1',
        conditions: [],
      };

      const req = {
        params: {
          userId: userMock,
          index: 4,
        },
      } as unknown as Request;

      await controller.deleteCondition(req, resp, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we call the getUserById', () => {
    test('Then, it should call the repo method and return the resp', async () => {
      const req = {
        info: {
          id: '124',
        },
      } as unknown as RequestPlus;

      await controller.getUserById(req, resp, next);
      (repoMock.readId as jest.Mock).mockReturnValue(['test']);
      expect(repoMock.readId).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then, if there is no token, it should call next', async () => {
      const req = {
        info: {
          id: undefined,
        },
      } as unknown as RequestPlus;

      await controller.getUserById(req, resp, next);
      (repoMock.readId as jest.Mock).mockReturnValue([]);
      expect(next).toHaveBeenCalled();
    });
  });
});
