import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
export const eventBus=new EventEmitter();
export function makeEvent(eventType,{rideId,driverId=null,offerId=null,payload={}}){return{eventId:randomUUID(),eventType,occurredAt:new Date().toISOString(),rideId,driverId,offerId,payload};}
export async function recordEvent(client,event){await client.query('INSERT INTO ride_events(event_id,event_type,ride_id,driver_id,offer_id,payload,occurred_at) VALUES($1,$2,$3,$4,$5,$6,$7)',[event.eventId,event.eventType,event.rideId,event.driverId,event.offerId,event.payload,event.occurredAt]);return event;}
export function publishAfterCommit(events){for(const event of events)eventBus.emit('event',event);}
