import { config } from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { buildDatabaseConfig } from '../../config/database.config';
import { buildDataSourceOptions } from './typeorm.config';

config();

export default new DataSource(buildDataSourceOptions(buildDatabaseConfig()));
