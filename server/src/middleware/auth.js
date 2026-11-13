import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { query } from '../db/pool.js';
import { AppError } from './errors.js';
export async function requireAuth(req, res, next) { try { const header=req.headers.authorization||''; if(!header.startsWith('Bearer ')) throw new AppError(401,'Authentication required','UNAUTHENTICATED'); const payload=jwt.verify(header.slice(7),config.JWT_SECRET); const result=await query('SELECT id,username,role,name,phone FROM users WHERE id=$1',[payload.sub]); if(!result.rowCount) throw new AppError(401,'User not found','UNAUTHENTICATED'); req.user=result.rows[0]; next(); } catch(e){ next(e instanceof AppError?e:new AppError(401,'Invalid token','UNAUTHENTICATED')); } }
export function signUser(user) { return jwt.sign({sub:user.id,role:user.role},config.JWT_SECRET,{expiresIn:config.JWT_EXPIRES_IN}); }
