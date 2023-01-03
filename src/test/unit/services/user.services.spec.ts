import { UserService } from "@services/user.service";
import { mockUserBuildArgs, mockLoggedUserData, mockUser } from "src/test/mock";
import { StubUserRepository } from "src/test/stub/repository";
import { StubConfigService, StubJwtService } from "src/test/stub/providers";
import { DUPLICATED_EMAIL, NOT_FOUND_USER } from "src/constants";
import { CookiesService } from "@providers/cookie";
import { ConfilctException, NotFoundException } from "src/common/exceptions";

describe("UserService", () => {
  let userRepository: StubUserRepository;
  const configService = new StubConfigService();
  const jwtService = new StubJwtService();
  const cookieService = new CookiesService();

  beforeEach(() => {
    userRepository = new StubUserRepository();
  });

  describe("UserService.Create", () => {
    describe("[Success]", () => {
      it("신규 유저 생성", async () => {
        userRepository.findByEmail.mockResolvedValue(undefined);
        userRepository.loggedUserData.mockResolvedValue(mockLoggedUserData);
        const userService = new UserService(
          userRepository,
          configService,
          jwtService,
          cookieService,
        );
        const body = mockUserBuildArgs;
        const result = await userService.create(body);
        expect(result).toEqual(mockLoggedUserData);
      });
    });
    describe("[Failure]", () => {
      it("이메일 중복으로 회원가입 실패", async () => {
        userRepository.findByEmail.mockResolvedValue(mockUser);
        const userService = new UserService(
          userRepository,
          configService,
          jwtService,
          cookieService,
        );
        const body = mockUserBuildArgs;
        await expect(userService.create(body)).rejects.toThrowError(
          new ConfilctException(DUPLICATED_EMAIL),
        );
      });
    });
  });
  describe("Userservice.login", () => {
    const userRepository = new StubUserRepository();
    const body = { email: mockUser.email };
    describe("[Success]", () => {
      it("login 성공", async () => {
        userRepository.findByEmail.mockResolvedValue(mockUser);
        userRepository.loggedUserData.mockResolvedValue(mockLoggedUserData);
        const userService = new UserService(
          userRepository,
          configService,
          jwtService,
          cookieService,
        );

        const result = await userService.login(body);

        expect(result).toEqual(mockLoggedUserData);
      });
    });
    describe("[Failure]", () => {
      it("찾을 수 없는 이메일로 로그인 시도", async () => {
        userRepository.findByEmail.mockResolvedValue(undefined);
        const userService = new UserService(
          userRepository,
          configService,
          jwtService,
          cookieService,
        );

        await expect(userService.login(body)).rejects.toThrowError(
          new NotFoundException(NOT_FOUND_USER),
        );
      });
    });
  });
});
