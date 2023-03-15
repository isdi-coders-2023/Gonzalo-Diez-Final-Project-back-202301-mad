import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { HTTPError } from '../errors/error.js';

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: TokenPayload) {
    return jwt.sign(payload, config.jwtSecret as string);
  }

  static verifyJWT(token: string): TokenPayload {
    const tokenInfo = jwt.verify(token, config.jwtSecret as string);

    if (typeof tokenInfo === 'string')
      throw new HTTPError(498, 'Invalid Token', tokenInfo);

    return tokenInfo as TokenPayload;
  }

  static toHash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static toUnHash(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
