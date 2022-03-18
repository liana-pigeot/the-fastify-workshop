import Fastify from 'fastify';
import autoload from 'fastify-autoload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildServer(config: any) {
  const opts = {
    ...config,
    logger: {
      prettyPrint: config.PRETTY_PRINT,
      logLevel: config.LOG_LEVEL,
    },
  }
  const fastify = Fastify(opts);
  fastify.register(import('fastify-postgres'), {
    connectionString: config.PG_CONNECTION_STRING,
  });
  
  fastify.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
  });
  fastify.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
  });
  return fastify;
}

export default buildServer;
