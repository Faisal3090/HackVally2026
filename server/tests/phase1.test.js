import { describe, expect, it } from 'vitest';
import { calculateFare } from '../src/services/fare.js';
import { haversineKm, etaMinutes } from '../src/services/geo.js';
describe('Phase 1 pure services',()=>{it('calculates haversine and ETA',()=>{const km=haversineKm({lat:15.8497,lng:74.4977},{lat:15.8597,lng:74.4977});expect(km).toBeGreaterThan(1);expect(etaMinutes(km)).toBeGreaterThan(0);});it('calculates INR fare with vehicle multiplier and breakdown',()=>{const fare=calculateFare({distanceKm:2,vehicleType:'SEDAN'});expect(fare.total).toBe(89);expect(fare.breakdown).toHaveLength(3);});});
