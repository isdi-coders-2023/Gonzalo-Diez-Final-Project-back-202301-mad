import { Router as router } from 'express';
import { UsersMongoRepo } from '../repositories/Users/users.mongo.repo.js';
import { UserController } from '../controllers/users.controller.js';
import { AuthInterceptor } from '../interceptors/auth.interceptor.js';

export const UsersRouter = router();
const UserRepo = UsersMongoRepo.getInstance();
const Interceptor = new AuthInterceptor(UserRepo);
const controller4Users = new UserController(UserRepo);

UsersRouter.post('/register', controller4Users.register.bind(controller4Users));
UsersRouter.post('/login', controller4Users.login.bind(controller4Users));
UsersRouter.patch(
  '/add-addiction',
  Interceptor.logged,
  controller4Users.addAddiction.bind(controller4Users)
);
UsersRouter.delete(
  '/delete/:index',
  Interceptor.logged,
  controller4Users.deleteAddiction.bind(controller4Users)
);
