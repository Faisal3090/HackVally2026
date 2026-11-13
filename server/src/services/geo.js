import { config } from '../config/index.js';
const rad=n=>n*Math.PI/180;
export function haversineKm(a,b){const dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
export function etaMinutes(distanceKm){return distanceKm/config.AVG_SPEED_KMH*60;}
