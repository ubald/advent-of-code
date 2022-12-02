import * as dotenv from 'dotenv';

/**
 * Configures dotenv so that we can pass an environment variable to determine
 * which .env file to load. Either `ENV` or `NODE_ENV` can be used, `ENV` will
 * take precedence over `NODE_ENV`. If no environment is specified, then the
 * default `.env` file will be loaded, if present.
 */
const env = process.env.ENV ?? process.env.NODE_ENV;
const path = env ? `.env.${env}` : '.env';
// eslint-disable-next-line no-console
console.log(`\nLoading environment variables from ${path} file`);
dotenv.config({ path });
