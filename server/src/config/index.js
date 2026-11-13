import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/hackvally'),
  TEST_DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/hackvally_test'),
  JWT_SECRET: z.string().min(1).default('change-me'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OFFER_TIMEOUT_SECONDS: z.coerce.number().positive().default(15),
  MAX_ATTEMPTS: z.coerce.number().int().positive().default(3),
  SEARCH_RADIUS_KM: z.coerce.number().positive().default(5),
  AVG_SPEED_KMH: z.coerce.number().positive().default(25),
  RANKER: z.string().default('nearest'),
  FAIR_DISPATCH_ENABLED: z.string().default('true').transform(v => v !== 'false'),
  ROUTING_PROVIDER: z.enum(['osrm', 'haversine']).default('osrm'),
  OSRM_BASE_URL: z.string().url().default('https://router.project-osrm.org'),
  ROUTING_TIMEOUT_MS: z.coerce.number().positive().default(2500),
  FARE_BASE: z.coerce.number().nonnegative().default(50),
  FARE_PER_KM: z.coerce.number().nonnegative().default(12),
  FARE_VEHICLE_MULTIPLIER: z.string().default('{"AUTO":0.8,"HATCHBACK":1,"SEDAN":1.2,"SUV":1.5}'),
  DEMO_MODE: z.string().default('true').transform(v => v !== 'false'),
  SERVICE_API_KEY: z.string().default('dev-service-key'),
  CITY_CENTER_LAT: z.coerce.number().default(15.8497),
  CITY_CENTER_LNG: z.coerce.number().default(74.4977)
});

const parsed = envSchema.parse(process.env);
let vehicleMultipliers;
try { vehicleMultipliers = JSON.parse(parsed.FARE_VEHICLE_MULTIPLIER); } catch { throw new Error('FARE_VEHICLE_MULTIPLIER must be valid JSON'); }

export const config = { ...parsed, FARE_VEHICLE_MULTIPLIER: vehicleMultipliers };
