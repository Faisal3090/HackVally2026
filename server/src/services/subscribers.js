import { eventBus } from './events.js';
import { query } from '../db/pool.js';
eventBus.on('event',async event=>{if(!event.rideId)return;let message;if(event.eventType==='DRIVER_ACCEPTED')message='Your driver accepted the ride';if(event.eventType==='RIDE_UNFULFILLED')message='No driver available, please try again';if(message){const ride=await query('SELECT passenger_id FROM rides WHERE id=$1',[event.rideId]);if(ride.rowCount)await query('INSERT INTO notifications(user_id,ride_id,message) VALUES($1,$2,$3)',[ride.rows[0].passenger_id,event.rideId,message]);}});
