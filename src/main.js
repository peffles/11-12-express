'use strict';

import { serverStart } from './lib/server';
import logger from './lib/logger';

serverStart(process.env.PORT, () => logger.log(logger.INFO, `MAIN - server running on port ${process.env.PORT}`));
