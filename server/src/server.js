import { app } from './app.js'; import { config } from './config/index.js';
app.listen(config.PORT,()=>console.log(`HackVally server listening on http://localhost:${config.PORT}`));
