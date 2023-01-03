import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "src/constants";

export const cors = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || req.headers.host || "";

  const isDev = process.env.NODE_ENV !== "production";

  const whiteList: string[] = [
    // Add something
    // example https://inflearn.com
  ];
  const allowed = isDev || whiteList.includes(origin);

  if (allowed) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, DELETE, PATCH, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(HttpStatus.OK);
  } else {
    next();
  }
};
