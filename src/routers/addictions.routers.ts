import { Router as router } from 'express';
import { AddictionsMongoRepo } from '../repositories/Addictions/addictions.mongo.repo.js';
import { AddictionsController } from '../controllers/Addictions/addictions.controller.js';

export const AddictionsRouter = router();
const AddictionsRepo = AddictionsMongoRepo.getInstance();
const controller4Addictions = new AddictionsController(AddictionsRepo);

AddictionsRouter.get(
  '/load',
  controller4Addictions.toLoad.bind(controller4Addictions)
);
