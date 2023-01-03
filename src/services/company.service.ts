import { CompanyCreateBodyDto } from "@controllers/v1/companies/dto";
import { ConfilctException } from "src/common/exceptions";
import { User } from "src/common/interface";
import {
  ALREADY_REGISTERED_USER,
  DUPLICATED_COMPANY_NAME,
} from "src/constants";
import { Companies } from "src/entity";
import { CompanyRepository, UsersRepository } from "src/repository";
import { injectable } from "tsyringe";

@injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UsersRepository,
  ) {}
  async create(body: CompanyCreateBodyDto, userId: string): Promise<User> {
    const { name } = body;

    const isCompany = await this.companyRepository.findByUserId(userId);

    if (isCompany) {
      throw new ConfilctException(ALREADY_REGISTERED_USER);
    }

    const existsName = await this.companyRepository.findByName(name);

    if (existsName) {
      throw new ConfilctException(DUPLICATED_COMPANY_NAME);
    }

    const company = Companies.build({ userId, name });

    await this.companyRepository.create(company);

    const loggedUserData = await this.userRepository.loggedUserData(userId);
    return loggedUserData!;
  }
}
