import nconf from 'nconf';
import path from 'path';
import { readFileSync } from 'fs';

const mode = process.env.NODE_ENV || 'development';
const resolve = (...args) => path.resolve(__dirname, ...args);
const read = file => readFileSync(resolve(file), 'utf8');

nconf
.env()
.file({ file: resolve(`${mode}.json`) })
.defaults({
  PORT: 7000,
  HTTPS_KEY: read('./certs/key.pem'),
  HTTPS_CERT: read('./certs/cert.pem')
});
