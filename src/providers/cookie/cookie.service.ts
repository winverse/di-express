import { CookieOptions, Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class CookiesService {
  setCookie(
    res: Response,
    name: string,
    token: string,
    options?: CookieOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        res.cookie(name, token, {
          ...options,
          httpOnly: true,
          secure: false,
          domain: undefined, // only work in development environment;
          path: "/",
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  getCookie<T>(req: Request, name: string) {
    const value: T | undefined = req.cookies[name];
    if (!value) return undefined;
    return value;
  }
  clearCookie(res: Response, name: string) {
    this.setCookie(res, name, "", {
      maxAge: 0,
    });
  }
}
