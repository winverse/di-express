import { Request, Response, Router } from "express";
import { container, injectable } from "tsyringe";
import { V1Controller } from "./v1";
import { BaseController } from "@controllers/base.controller";
import { format } from "date-fns";
import { HttpStatus } from "src/constants";

@injectable()
export class Controller extends BaseController {
  constructor() {
    super();
  }
  routes(): Router {
    const v1controllers = container.resolve(V1Controller);

    this.router.use("/v1", v1controllers.routes());
    this.router.get("/ping", this.ping);

    return this.router;
  }
  ping(req: Request, res: Response) {
    const time = new Date();
    const formattedTime = format(time, "yyyy-MM-dd HH:MM:SS");
    const message = `현재 시간: ${formattedTime}`;
    res.status(HttpStatus.OK).send(message);
  }
}
