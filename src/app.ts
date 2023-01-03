import express, { Express } from "express";
import { Controller } from "@controllers/index";
import cookieParser from "cookie-parser";
import { container, singleton } from "tsyringe";
import { Authorization, cors } from "src/middlewares";
import { LoggerService } from "@providers/logger";

@singleton()
class App {
  app: Express;
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    const authorization = container.resolve(Authorization);

    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors);
    this.app.use((req, res, next) => authorization.authorize(req, res, next));
  }

  routes() {
    const controller = new Controller();

    this.app.use("/api", controller.routes());
  }

  listen(port: string) {
    this.app.listen(port, () => {
      const logger = container.resolve(LoggerService);
      logger.info(`Server is running port number is ${port}`);
    });
  }
}

const app = new App();

export default app;
