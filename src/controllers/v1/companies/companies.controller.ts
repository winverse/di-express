import { BaseController } from "@controllers/base.controller";
import { CompanyCreateBodyDto } from "@controllers/v1/companies/dto";
import { UtilsService } from "@providers/utils";
import { CompanyService } from "@services/company.service";
import { UserService } from "@services/user.service";
import { Request, Router, Response } from "express";
import { HttpStatus } from "src/constants";
import { needsLogin } from "src/middlewares/needsAuth";
import { injectable } from "tsyringe";

@injectable()
export class CompaniesController extends BaseController {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
  ) {
    super();
  }
  routes(): Router {
    this.router.post("/", needsLogin, (req, res) => this.create(req, res));
    return this.router;
  }
  // 강사 생성
  async create(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        CompanyCreateBodyDto,
        req.body,
      );

      if (!validate) return;

      const userId = req.user!.id;

      const loggedUserData = await this.companyService.create(req.body, userId);

      await this.userService.setJwtToken(res, loggedUserData);

      res.sendStatus(HttpStatus.CREATED);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
