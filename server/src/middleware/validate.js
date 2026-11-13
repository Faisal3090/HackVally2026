import { AppError } from './errors.js';
export const validate = schema => (req,res,next) => { const parsed=schema.safeParse(req.body); if(!parsed.success) return next(new AppError(400,parsed.error.issues.map(i=>i.message).join('; '),'VALIDATION_ERROR')); req.body=parsed.data; next(); };
