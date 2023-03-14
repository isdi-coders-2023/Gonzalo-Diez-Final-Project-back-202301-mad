import { UserController } from './users.controller';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { URepo } from '../repositories/Users/users.repo.interface';
import { Auth } from '../helpers/auth';

jest.mock('../helpers/auth');

describe('Given the user controller', () => {
  const mockPassword = 'test';

  const repoMock = {
    create: jest.fn(),
    search: jest.fn(),
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
    test('Then, if there is no password, it should return the next funtion', async () => {
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
});
