import { AppError } from './errors.js';
export const requireRole = (...roles) => (req,res,next) => roles.includes(req.user?.role) ? next() : next(new AppError(403,'Insufficient role','FORBIDDEN'));
