import { Router } from "express";
import { container, injectable } from "tsyringe";
import { BaseController } from "@controllers/base.controller";
import { UsersController } from "./users";
import { CompaniesController } from "@controllers/v1/companies";
import { NoticesController } from "@controllers/v1/notices";

@injectable()
export class V1Controller extends BaseController {
  constructor() {
    super();
  }
  routes(): Router {
    const usersController = container.resolve(UsersController);
    const companiesController = container.resolve(CompaniesController);
    const noticesController = container.resolve(NoticesController);

    this.router.use("/users", usersController.routes());
    this.router.use("/companies", companiesController.routes());
    this.router.use("/notices", noticesController.routes());

    return this.router;
  }
}
