import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config();

const config = {
  version: '1.0.0',
  env: 'development',
  port: '3000'
};

export default config;