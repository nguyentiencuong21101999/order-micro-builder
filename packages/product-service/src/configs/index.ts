import { Type, plainToInstance } from "class-transformer";
import { IsString, ValidateNested, validateSync } from "class-validator";
import "dotenv/config";
import Container, { Service } from "typedi";
import { MySqlDataSourceConfig } from "./db.config";
import { JwtConfig } from "./jwt.config";
import { MailerConfig } from "./mailer.config";
import { RedisConfig } from "./redis.config";
@Service()
export class Config {
  @IsString()
  nodeEnv: string;

  @IsString()
  port: string;

  @ValidateNested()
  @Type(() => RedisConfig)
  redis: RedisConfig;

  @ValidateNested()
  @Type(() => MySqlDataSourceConfig)
  masterDb: MySqlDataSourceConfig;

  @ValidateNested()
  @Type(() => JwtConfig)
  jwt: JwtConfig;

  @IsString()
  basicAuthPassword: string;

  @ValidateNested()
  @Type(() => MailerConfig)
  mailer: MailerConfig;

  constructor() {
    const env = process.env;
    this.nodeEnv = env.NODE_ENV;
    this.port = env.PORT;
    this.masterDb = JSON.parse(env.MASTER_DB);
    this.jwt = JSON.parse(env.JWT);
    this.redis = JSON.parse(env.REDIS);
    this.basicAuthPassword = env.BASIC_AUTH_PASSWORD;
    this.mailer = JSON.parse(env.MAILER);
  }

  isProduction() {
    return this.nodeEnv === "production";
  }
}

export const validateConfig = (config: Config) => {
  const errors = validateSync(plainToInstance(Config, config));
  if (errors.length) {
    const childErrors = errors.map((e) => e.children).flat();
    const constraints = [...errors, ...childErrors].map((e) => e.constraints);
    throw new Error(`Env validation error: ${JSON.stringify(constraints)}`);
  }
};
export const config = Container.get(Config);
