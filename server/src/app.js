import express from 'express';
import { apiRouter } from './routes/index.js';
import './services/subscribers.js';
import { errorHandler } from './middleware/errors.js';
export const app=express(); app.use(express.json()); app.get('/health',(req,res)=>res.json({ok:true})); app.use('/api/v1',apiRouter); app.use(errorHandler);
