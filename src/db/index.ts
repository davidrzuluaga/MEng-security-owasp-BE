import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || '';
const POSTGRES_USER = process.env.POSTGRES_USER || '';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const POSTGRES_DIALECT = process.env.POSTGRES_DIALECT || '';
const POSTGRES_HOST = process.env.POSTGRES_HOST || '';

const sequelize: Sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, {
  dialect: POSTGRES_DIALECT as Dialect,
  host: POSTGRES_HOST,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  models: [__dirname + '/**/*.model.ts'],
});

export default sequelize;
