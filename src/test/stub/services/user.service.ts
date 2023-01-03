import { UserService } from "@services/user.service";
import {
  StubConfigService,
  StubCookieService,
  StubJwtService,
} from "src/test/stub/providers";
import { StubUserRepository } from "src/test/stub/repository";
import { Stub } from "src/test/stub/stub.interface";

export class StubUserService extends UserService implements Stub<UserService> {
  constructor() {
    const userRepository = new StubUserRepository();
    const configService = new StubConfigService();
    const jwtService = new StubJwtService();
    const cookieService = new StubCookieService();
    super(userRepository, configService, jwtService, cookieService);
  }
  override create = jest.fn();
  override login = jest.fn();
  override withdrawal = jest.fn();
  override setJwtToken = jest.fn();
}
