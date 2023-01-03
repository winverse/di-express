import httpMocks from "node-mocks-http";
import { container } from "tsyringe";
import { UtilsService } from "@providers/utils";
import { Request, Response } from "express";
import { IsEmail } from "class-validator";

export class MockRequestDto {
  @IsEmail()
  email: string;
}

describe("Utils service", () => {
  let utilsService: UtilsService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    utilsService = container.resolve(UtilsService);
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });
  describe("utilsService.mode", () => {
    it("Should be development environment is true when test code run", () => {
      const { isDev, isProd } = utilsService.mode;
      expect(isDev).toBeTruthy();
      expect(isProd).toBeFalsy();
    });
  });
  describe("utilsSevice.validateSchema", () => {
    it("Should be validate success", async () => {
      req.body = { email: "public.winverse@gmail.com" };
      const validate = await utilsService.validateSchema(
        res,
        MockRequestDto,
        req.body,
      );
      expect(validate).toBe(true);
    });
    it("Should be validate failed", async () => {
      req.body = { email: "Jang SangHyun" };
      const validate = await utilsService.validateSchema(
        res,
        MockRequestDto,
        req.body,
      );
      expect(validate).toBe(false);
    });
  });
});
