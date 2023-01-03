import { Router } from "express";
import { container, injectable } from "tsyringe";
import { BaseController } from "@controllers/base.controller";
import { UsersController } from "./users";

@injectable()
export class V1Controller extends BaseController {
  constructor() {
    super();
  }
  routes(): Router {
    const usersController = container.resolve(UsersController);

    this.router.use("/users", usersController.routes());

    return this.router;
  }
}
