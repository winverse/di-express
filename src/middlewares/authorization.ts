import { authroizationCookie, CookiesService } from "@providers/cookie";
import {
  AccessTokenDecoded,
  JwtService,
  RefreshTokenDecoded,
} from "@providers/jwt";
import { LoggerService } from "@providers/logger";
import { UserService } from "@services/user.service";
import { NextFunction, Request, Response } from "express";
import { UsersRepository } from "src/repository";
import { injectable } from "tsyringe";

@injectable()
export class Authorization {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookiesService,
    private readonly userRepository: UsersRepository,
    private readonly userService: UserService,
    private readonly loggerService: LoggerService,
  ) {}
  async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      const { access_token: accessToken, refresh_token: refreshToken } =
        req.cookies as authroizationCookie;

      if (accessToken) {
        const decoded = await this.jwtService.decodedToken<AccessTokenDecoded>(
          accessToken,
        );

        const user = await this.userRepository.findById(decoded.user.id);

        if (!user) {
          throw new Error("NOT EXISTS USER");
        }

        req.user = decoded.user;
      } else if (refreshToken) {
        const decoded = await this.jwtService.decodedToken<RefreshTokenDecoded>(
          refreshToken,
        );

        const user = await this.userRepository.loggedUserData(decoded.user.id);

        if (!user) {
          throw new Error("NOT EXISTS USER");
        }

        // restore access_token
        await this.userService.setJwtToken(res, user);

        // Add refresh logic
        req.user = user;
      }
    } catch (error) {
      this.cookieService.clearCookie(res, "access_token");
      this.cookieService.clearCookie(res, "refresh_token");
    }
    next();
  }
}
