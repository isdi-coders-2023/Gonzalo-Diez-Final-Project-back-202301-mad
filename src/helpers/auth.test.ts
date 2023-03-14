import { Auth } from './auth';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './auth';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Given the Auth Class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the CreateJWT method is called', () => {
    const payloadMock = {
      id: '1',
      email: 'test',
    };
    test('Then, if it has a valid Payload, it should been called', () => {
      Auth.createJWT(payloadMock);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('When the verifyJWT method is called', () => {
    const tokenMock = 'test';
    const payloadMock = {
      id: '1',
      email: 'test',
    };
    test('Then, if jwt.verify returns a correct PayLoad, it should be called ', () => {
      (jwt.verify as jest.Mock).mockReturnValue(payloadMock);
      Auth.verifyJWT(tokenMock);
      expect(jwt.verify).toHaveBeenCalled();
    });
    test('Then, if jwt.verify receives an unvalid payload, it should throw an error', () => {
      (jwt.verify as jest.Mock).mockReturnValue('string');
      expect(() => Auth.verifyJWT(tokenMock)).toThrow();
    });
  });
  describe('When the toHash method is called', () => {
    test('Then, it should call the bcrypt.hash function', () => {
      Auth.toHash('test');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });
  describe('When the toUnHash method is called', () => {
    test('Then, it should call the bcrypt.compare function', () => {
      Auth.toUnHash('test', 'randomHash');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
