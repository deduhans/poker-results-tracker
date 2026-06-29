import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import entities from './index';

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  dotenv.config({ path: path.resolve(__dirname, '../../env/.env.local') });
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities,
  migrations: [path.resolve(__dirname, `../migration/*.${isProd ? 'js' : 'ts'}`)],
});
