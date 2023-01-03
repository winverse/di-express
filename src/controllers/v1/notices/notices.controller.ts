import { BaseController } from "@controllers/base.controller";
import {
  NoticeBulkCreateBodyDto,
  NoticeCreateBodyDto,
  NoticeUpdateBodyDto,
  NoticeSetPublishBodyDto,
  NoticeRegisterBodyDto,
  NoticeListQueryDto,
} from "./dto";

import { UtilsService } from "@providers/utils";
import { Request, Response, Router } from "express";
import { HttpStatus } from "src/constants";
import { needsCompany, needsLogin } from "src/middlewares/needsAuth";
import { injectable } from "tsyringe";
import { isCuid } from "cuid";
import { NoticeService } from "@services/notice.service";

@injectable()
export class NoticesController extends BaseController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly utilsService: UtilsService,
  ) {
    super();
  }
  routes(): Router {
    // create Notice
    this.router.post("/", needsCompany, (req, res) => this.create(req, res));
    // bulk create Notice
    this.router.post("/bulks", needsCompany, (req, res) =>
      this.bulkCreate(req, res),
    );
    // update Notice
    this.router.patch("/:noticeId", needsCompany, (req, res) =>
      this.update(req, res),
    );
    // handle notice
    this.router.patch("/publish/:noticdId", needsCompany, (req, res) =>
      this.publish(req, res),
    );
    // get notice list
    this.router.get("/", (req, res) => this.list(req, res));
    // notice detail
    this.router.get("/:noticeId", (req, res) => this.detail(req, res));
    // notice applicants
    this.router.post("/register", needsLogin, (req, res) =>
      this.register(req, res),
    );
    this.router.delete("/:noticeId", (req, res) => this.delete(req, res));

    return this.router;
  }

  async create(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        NoticeCreateBodyDto,
        req.body,
      );

      if (!validate) return;

      const companyId = req.user!.company!.id;

      await this.noticeService.create(req.body, companyId);

      res.sendStatus(HttpStatus.CREATED);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 강의 대량 생성
  async bulkCreate(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        NoticeBulkCreateBodyDto,
        req.body,
      );

      if (!validate) return;
      const companyId = req.user!.company!.id;

      await this.noticeService.bulkCreate(req.body, companyId);

      res.sendStatus(HttpStatus.CREATED);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 강의 수정
  async update(req: Request, res: Response) {
    try {
      const { noticeId } = req.params;

      if (!isCuid(noticeId)) {
        res.sendStatus(HttpStatus.BAD_REQUEST);
        return;
      }

      const validate = await this.utilsService.validateSchema(
        res,
        NoticeUpdateBodyDto,
        req.body,
      );

      if (!validate) return;

      const companyId = req.user!.company!.id;
      await this.noticeService.update(req.body, noticeId, companyId);

      res.sendStatus(HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 강의 오픈
  async publish(req: Request, res: Response) {
    try {
      const { noticeId } = req.params;

      if (!isCuid(noticeId)) {
        res.sendStatus(HttpStatus.BAD_REQUEST);
        return;
      }

      const validate = await this.utilsService.validateSchema(
        res,
        NoticeSetPublishBodyDto,
        req.body,
      );

      if (!validate) return;

      const companyId = req.user!.company!.id;
      await this.noticeService.setPublish(req.body, noticeId, companyId);
      res.sendStatus(200);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 목록 조회
  async list(req: Request, res: Response) {
    try {
      const query = this.utilsService.stringToNumber<NoticeListQueryDto>(
        req.query,
      );

      const validate = await this.utilsService.validateSchema(
        res,
        NoticeListQueryDto,
        query,
      );

      if (!validate) return;

      const result = await this.noticeService.list(query);

      res.status(HttpStatus.OK).send(result);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 상세 조회
  async detail(req: Request, res: Response) {
    try {
      const { noticeId } = req.params;

      if (!isCuid(noticeId)) {
        res.sendStatus(HttpStatus.BAD_REQUEST);
        return;
      }

      const result = await this.noticeService.detail(noticeId);

      res.status(HttpStatus.OK).send(result);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  // 수강 신청
  async register(req: Request, res: Response) {
    try {
      const validate = await this.utilsService.validateSchema(
        res,
        NoticeRegisterBodyDto,
        req.body,
      );

      if (!validate) return;

      const userId = req.user!.id;
      await this.noticeService.register(req.body, userId);
      res.sendStatus(200);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { noticeId } = req.params;

      if (!isCuid(noticeId)) {
        res.sendStatus(HttpStatus.BAD_REQUEST);
        return;
      }

      await this.noticeService.delete(noticeId);
      res.sendStatus(200);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
