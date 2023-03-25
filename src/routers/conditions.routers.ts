import { Router as router } from 'express';
import { ConditionsMongoRepo } from '../repositories/Conditions/conditions.mongo.repo.js';
import { ConditionsController } from '../controllers/Conditions/conditions.controller.js';

export const ConditionsRouter = router();
const ConditionsRepo = ConditionsMongoRepo.getInstance();
const controller4Conditions = new ConditionsController(ConditionsRepo);

ConditionsRouter.get(
  '/load',
  controller4Conditions.toLoad.bind(controller4Conditions)
);
