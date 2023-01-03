import { UserCreateBodyDto, UserLoginBodyDto } from "@controllers/v1/users/dto";
import { ConfigService } from "@providers/config";
import { CookiesService } from "@providers/cookie";
import { JwtService } from "@providers/jwt";
import { Response } from "express";
import { NotFoundException, ConfilctException } from "src/common/exceptions";
import { User } from "src/common/interface";
import { DUPLICATED_EMAIL, NOT_FOUND_USER } from "src/constants";
import { Users } from "src/entity";
import { UsersRepository } from "src/repository";
import { injectable } from "tsyringe";

@injectable()
export class UserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookiesService,
  ) {}
  async create(body: UserCreateBodyDto): Promise<User> {
    const { email, username } = body;

    const exists = await this.userRepository.findByEmail(email);

    if (exists) {
      throw new ConfilctException(DUPLICATED_EMAIL);
    }

    const user = Users.build({ email, username });

    await this.userRepository.create(user);

    const loggedUserData = await this.userRepository.loggedUserData(user.id);
    return loggedUserData!;
  }
  async login(body: UserLoginBodyDto): Promise<User> {
    const { email } = body;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(NOT_FOUND_USER);
    }

    const loggedUserData = await this.userRepository.loggedUserData(user.id);
    return loggedUserData!;
  }
  async setJwtToken(res: Response, loggedUserData: User) {
    try {
      const { jwt: jwtConfig } = this.configService.get();
      const accessToken = await this.jwtService.signToken(
        { user: loggedUserData },
        { expiresIn: jwtConfig.accessTokenMaxAge },
      );
      const refreshToken = await this.jwtService.signToken(
        {
          user: { id: loggedUserData.id },
        },
        { expiresIn: jwtConfig.refreshTokenMaxAge },
      );

      await this.cookieService.setCookie(res, "access_token", accessToken, {
        maxAge: jwtConfig.accessTokenMaxAge * 1000, // cookie maxAge base on 1ms
      });

      await this.cookieService.setCookie(res, "refresh_token", refreshToken, {
        maxAge: jwtConfig.refreshTokenMaxAge * 1000, // cookie maxAge base on 1ms
      });
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async withdrawal(userId: string) {
    await this.userRepository.withdrawal(userId);
  }
}
