'use strict';

import { startServer } from './lib/server';
import logger from './lib/logger';

startServer(process.env.PORT, () => logger.log(logger.INFO, `MAIN - server running on port ${process.env.PORT}`));
