import { Response, Request, Router } from "express";
import { BaseController } from "@controllers/base.controller";

import { UserService } from "src/services";
import { injectable } from "tsyringe";
import { UserCreateBodyDto, UserLoginBodyDto } from "./dto";
import { UtilsService } from "@providers/utils";
import { CookiesService } from "@providers/cookie";
import { needsLogin } from "src/middlewares/needsAuth";
import { UserWithdrawalBodyDto } from "@controllers/v1/users/dto/userWithdrawalBody.dto";
import { HttpStatus } from "src/constants";

@injectable()
export class UsersController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
    private readonly cookieService: CookiesService,
  ) {
    super();
  }
  routes(): Router {
    this.router.post("/", (req, res) => this.create(req, res));
    this.router.post("/login", (req, res) => this.login(req, res));
    this.router.post("/logout", (req, res) => this.logout(req, res));
    this.router.post("/withdrawal", needsLogin, (req, res) =>
      this.withdrawal(req, res),
    );
    return this.router;
  }
  // 회원가입
  async create(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        UserCreateBodyDto,
        req.body,
      );

      if (!validate) return;

      const loggedUserData = await this.userService.create(req.body);
      await this.userService.setJwtToken(res, loggedUserData);

      res.sendStatus(HttpStatus.CREATED);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 로그인
  async login(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        UserLoginBodyDto,
        req.body,
      );

      if (!validate) return;

      const loggedUserData = await this.userService.login(req.body);
      await this.userService.setJwtToken(res, loggedUserData);

      res.sendStatus(HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 로그아웃
  async logout(req: Request, res: Response) {
    try {
      await this.cookieService.clearCookie(res, "access_token");
      await this.cookieService.clearCookie(res, "refresh_token");
      res.sendStatus(HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 회원 탈퇴
  async withdrawal(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        UserWithdrawalBodyDto,
        req.body,
      );

      if (!validate) return;

      const userId = req.user!.id;

      await this.userService.withdrawal(userId);
      await this.logout(req, res);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
