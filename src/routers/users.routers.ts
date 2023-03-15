import { Router as router } from 'express';
import { UsersMongoRepo } from '../repositories/Users/users.mongo.repo.js';
import { UserController } from '../controllers/users.controller.js';

export const UsersRouter = router();
const UserRepo = UsersMongoRepo.getInstance();
const controller4Users = new UserController(UserRepo);

UsersRouter.post('/register', controller4Users.register.bind(controller4Users));
UsersRouter.post('/login', controller4Users.login.bind(controller4Users));
