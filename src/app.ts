import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { CustomError } from './errors/error.js';
import { UsersRouter } from './routers/users.routers.js';
import { AddictionsRouter } from './routers/addictions.routers.js';
import { ConditionsRouter } from './routers/conditions.routers.js';

const debug = createDebug('MH:app');

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', UsersRouter);
app.use('/addictions', AddictionsRouter);
app.use('/conditions', ConditionsRouter);

app.get('/', (_req, resp) => {
  resp.json({
    endpoints: {},
  });
});

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Errors middleware');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    resp.json({ error: [{ status, statusMessage }] });
    debug(status, statusMessage, error.message);
  }
);
