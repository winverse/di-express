import { LoggerService } from "@providers/logger";
import express, { Response, Router } from "express";
import { HttpException } from "src/common/exceptions";
import { HttpStatus } from "src/constants";
import { container } from "tsyringe";

export abstract class BaseController {
  protected router: Router;
  constructor() {
    this.router = express.Router();
  }
  abstract routes(): Router;
  handleError(res: Response, error: any) {
    if (error instanceof HttpException) {
      res.status(error.statusCode).send(error.description);
    } else {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const loggerService = container.resolve(LoggerService);
    loggerService.error(error);
  }
}
