import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errors.js';
import { haversineKm } from '../services/geo.js';
import { getEtaMatrix } from '../services/routing.js';
import { config } from '../config/index.js';
export const driversRouter=Router(); driversRouter.use(requireAuth);
driversRouter.post('/me/availability',requireRole('driver'),validate(z.object({available:z.boolean()})),async(req,res,next)=>{try{const r=await query("UPDATE drivers SET status=CASE WHEN $2 THEN 'AVAILABLE' ELSE 'OFFLINE' END, online_since=CASE WHEN $2 THEN COALESCE(online_since,now()) ELSE NULL END, last_heartbeat=CASE WHEN $2 THEN now() ELSE last_heartbeat END WHERE user_id=$1 AND status <> 'BUSY' RETURNING *",[req.user.id,req.body.available]);if(!r.rowCount){const d=await query('SELECT status FROM drivers WHERE user_id=$1',[req.user.id]);if(d.rows[0]?.status==='BUSY')throw new AppError(409,'Busy drivers cannot go offline','DRIVER_BUSY');throw new AppError(404,'Driver profile not found','NOT_FOUND');}res.json(r.rows[0]);}catch(e){next(e);}});
driversRouter.post('/me/location',requireRole('driver'),validate(z.object({lat:z.number().gte(-90).lte(90),lng:z.number().gte(-180).lte(180)})),async(req,res,next)=>{try{const r=await query('UPDATE drivers SET lat=$2,lng=$3,last_heartbeat=now() WHERE user_id=$1 RETURNING id,lat,lng,status',[req.user.id,req.body.lat,req.body.lng]);if(!r.rowCount)throw new AppError(404,'Driver profile not found','NOT_FOUND');res.json(r.rows[0]);}catch(e){next(e);}});
driversRouter.get('/me',requireRole('driver'),async(req,res,next)=>{try{const r=await query('SELECT id,vehicle_type AS "vehicleType",vehicle_number AS "vehicleNumber",lat,lng,status,offers_received AS "offersReceived",rides_completed AS "ridesCompleted",accept_rate AS "acceptRate" FROM drivers WHERE user_id=$1',[req.user.id]);if(!r.rowCount)throw new AppError(404,'Driver profile not found','NOT_FOUND');res.json(r.rows[0]);}catch(e){next(e);}});
driversRouter.get('/nearby', requireRole('passenger'), async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radiusKm || config.SEARCH_RADIUS_KM);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new AppError(400, 'lat and lng are required', 'VALIDATION_ERROR');
    const result = await query("SELECT d.id, u.name, d.lat, d.lng, d.vehicle_type FROM drivers d JOIN users u ON u.id=d.user_id WHERE d.status='AVAILABLE' AND d.lat IS NOT NULL AND d.lng IS NOT NULL");
    const candidates = result.rows
      .map(d => ({ ...d, vehicleType: d.vehicle_type }))
      .filter(d => !req.query.vehicleType || d.vehicleType === req.query.vehicleType)
      .map(d => ({ ...d, distanceKm: haversineKm({ lat, lng }, { lat: d.lat, lng: d.lng }) }))
      .filter(d => d.distanceKm <= radius);
    const matrix = await getEtaMatrix(candidates, { lat, lng });
    res.json(candidates.map(d => ({ ...d, ...matrix[d.id] })).sort((a, b) => a.distanceKm - b.distanceKm));
  } catch (e) { next(e); }
});
