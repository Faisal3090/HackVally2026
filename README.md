# HackVally Ride Matching MVP

Phase 1 implements the foundation only: PostgreSQL migrations, validated configuration, JWT registration/login/me, driver availability/location/nearby APIs, OSRM routing with cached haversine fallback, INR fare calculation, zone-intelligence safe defaults, event recording/subscriber hooks, ride estimates, demo seeding, and pure-service tests.

## Requirements

- Node.js 20+
- PostgreSQL 14+

Create a database, copy `server/.env.example` to `server/.env`, and set `DATABASE_URL` and `JWT_SECRET`.

```powershell
npm install
npm run migrate
npm run seed
npm run dev
```

The API listens on `http://localhost:4000`. The client is intentionally a Phase 3 placeholder.

## Demo credentials

Users `driver1` through `driver10`, `passenger1` through `passenger3`, and `admin` all use password `demo1234`.

## Phase 1 verification

```powershell
$base = 'http://localhost:4000/api/v1'
$passenger = Invoke-RestMethod "$base/auth/login" -Method Post -ContentType 'application/json' -Body '{"username":"passenger1","password":"demo1234"}'
$driver = Invoke-RestMethod "$base/auth/login" -Method Post -ContentType 'application/json' -Body '{"username":"driver1","password":"demo1234"}'
$headers = @{ Authorization = "Bearer $($passenger.token)" }
$driverHeaders = @{ Authorization = "Bearer $($driver.token)" }
Invoke-RestMethod "$base/drivers/nearby?lat=15.8497&lng=74.4977" -Headers $headers
Invoke-RestMethod "$base/drivers/me/availability" -Method Post -Headers $driverHeaders -ContentType 'application/json' -Body '{"available":true}'
Invoke-RestMethod "$base/rides/estimate" -Method Post -Headers $headers -ContentType 'application/json' -Body '{"pickup":{"lat":15.8497,"lng":74.4977},"drop":{"lat":15.86,"lng":74.51},"vehicleType":"HATCHBACK"}'
```

For deterministic offline routing verification, set `ROUTING_PROVIDER=haversine` in `.env`; the estimate response reports `routeSource: "haversine"`.

Run tests with `npm test`. The Phase 1 tests cover haversine/ETA and fare calculation; database-backed endpoint tests require a running PostgreSQL database and are intentionally reserved for the full integration suite.

## Assumptions and deferrals

- The Phase 1 estimate uses the route distance and does not create a ride or offer.
- The final fare will equal the estimate in this MVP.
- Offer expiry, dispatch, ride lifecycle, history, and the React UI are Phase 2/3 work.
- No changes were made to unrelated files; `main` was not merged or pushed.
