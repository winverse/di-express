import "reflect-metadata";
import dotenv from "dotenv";
import { container } from "tsyringe";
import app from "./app";

import { DbService } from "@providers/db";
import { ConfigService } from "@providers/config";

async function bootstrap() {
  // config validate
  const configService = container.resolve(ConfigService);
  configService.validate();

  // database connection
  const dbService = container.resolve(DbService);
  dbService.connect();

  // run app
  const PORT = process.env.PORT;

  if (!PORT) {
    throw new Error("MISSING PORT NUMBER");
  }

  app.listen(PORT);
}

dotenv.config();
bootstrap();
