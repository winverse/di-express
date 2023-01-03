import { Config } from "@providers/config/config.interface";
import { UtilsService } from "@providers/utils/utils.service";
import Joi from "joi";
import { injectable } from "tsyringe";

@injectable()
export class ConfigService {
  constructor(private readonly utilsService: UtilsService) {}
  validate() {
    const config = this.configLoader();
    const schema = Joi.object().keys({
      app: Joi.object().keys({
        port: Joi.number().required(),
        host: Joi.string().required(),
      }),
      db: Joi.object().keys({
        provider: Joi.string().valid("postgres").required(),
        host: Joi.string().required(),
        database: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().allow("").required(),
      }),
      jwt: {
        jwtSecretKey: Joi.string().required(),
        cookieSecretKey: Joi.string().required(),
        accessTokenMaxAge: Joi.number()
          .integer()
          .positive()
          .allow(0)
          .required(),
        refreshTokenMaxAge: Joi.number()
          .integer()
          .positive()
          .allow(0)
          .required(),
      },
    });

    const { error } = schema.validate(config);

    if (error) {
      console.error(`config validate failed, message: ${error.message}`);
      process.exit(0);
    }
  }
  public get(): Config {
    return this.configLoader();
  }
  private configLoader(): Config {
    const { config } = this.utilsService.mode.isDev
      ? require("../../../config/development")
      : require("../../../config/production");
    return config;
  }
}
