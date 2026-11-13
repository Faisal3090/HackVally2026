import { Router } from 'express';
import { authRouter } from './auth.js'; import { driversRouter } from './drivers.js'; import { ridesRouter } from './rides.js'; import { devRouter } from './dev.js';
export const apiRouter=Router(); apiRouter.use('/auth',authRouter); apiRouter.use('/drivers',driversRouter); apiRouter.use('/rides',ridesRouter); apiRouter.use('/dev',devRouter);
