import { config } from 'dotenv';
import { EnvironmentVariableKeys } from './keys';
import { ServerEnvironments } from '../modules/shared/enums/server_environments.enum';

// environment
const environment = process.env.NODE_ENV || ServerEnvironments.DEVELOPMENT;
config({ path: `.env.${environment}` });

export class Config {
  /**
   * @description get value
   * @param key
   * @returns
   */
  static getValue(key: EnvironmentVariableKeys): string {
    const env = process.env;
    const value = env[key];
    return value!;
  }
}
