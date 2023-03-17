import dotenv from 'dotenv';
dotenv.config();

export const config = {
  user: process.env.user,
  password: encodeURIComponent(process.env.password as string),
  cluster: process.env.cluster,
  dbName: process.env.dbName,
  jwtSecret: process.env.jwtSecret,
};
