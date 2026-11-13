import { Router } from 'express';
import { config } from '../config/index.js';
export const devRouter=Router();
devRouter.get('/config',(req,res)=>res.json({ranker:config.RANKER,fairDispatchEnabled:config.FAIR_DISPATCH_ENABLED,routingProvider:config.ROUTING_PROVIDER,demoMode:config.DEMO_MODE}));
