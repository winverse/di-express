import { CompanyService } from "@services/company.service";
import { ConfilctException } from "src/common/exceptions";
import {
  ALREADY_REGISTERED_USER,
  DUPLICATED_COMPANY_NAME,
} from "src/constants";
import {
  mockCompanyBuildArgs,
  mockCompany,
  mockLoggedUserData,
} from "src/test/mock";
import {
  StubCompanyRepository,
  StubUserRepository,
} from "src/test/stub/repository";

describe("CompanyService", () => {
  let companyRepository: StubCompanyRepository;
  let userRepository: StubUserRepository;

  beforeEach(() => {
    companyRepository = new StubCompanyRepository();
    userRepository = new StubUserRepository();
  });

  describe("CompanyService.create", () => {
    describe("[Success]", () => {
      it("기업 생성 성공", async () => {
        companyRepository.findByUserId.mockResolvedValue(undefined);
        companyRepository.findByName.mockResolvedValue(undefined);
        userRepository.loggedUserData.mockResolvedValue(mockLoggedUserData);
        const companyService = new CompanyService(
          companyRepository,
          userRepository,
        );
        const body = mockCompanyBuildArgs;
        const result = await companyService.create(
          { name: body.name },
          body.userId,
        );

        expect(result).toEqual(mockLoggedUserData);
      });
    });
    describe("[Failure]", () => {
      it("이미 기업로 등록 된 경우", async () => {
        companyRepository.findByUserId.mockResolvedValue(mockCompany);
        companyRepository.findByName.mockResolvedValue(undefined);
        const companyService = new CompanyService(
          companyRepository,
          userRepository,
        );
        const body = mockCompanyBuildArgs;
        await expect(
          companyService.create({ name: body.name }, body.userId),
        ).rejects.toThrowError(new ConfilctException(ALREADY_REGISTERED_USER));
      });
      it("기업명이 중복되는 경우", async () => {
        companyRepository.findByUserId.mockResolvedValue(undefined);
        companyRepository.findByName.mockResolvedValue(mockCompany);
        const companyService = new CompanyService(
          companyRepository,
          userRepository,
        );

        const body = mockCompanyBuildArgs;
        await expect(
          companyService.create({ name: body.name }, body.userId),
        ).rejects.toThrowError(new ConfilctException(DUPLICATED_COMPANY_NAME));
      });
    });
  });
});
