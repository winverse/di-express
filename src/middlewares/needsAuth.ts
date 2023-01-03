import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "src/constants";

const authMiddleware =
  (fn: (req: Request) => boolean) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req) ? next() : res.sendStatus(HttpStatus.UNAUTHORIZED);

const isLogin = (req: Request) => !!req.user;
const isCompany = (req: Request) => !!req.user?.company;

export const needsLogin = authMiddleware(isLogin);
export const needsCompany = authMiddleware(isCompany);
