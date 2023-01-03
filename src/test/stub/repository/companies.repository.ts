import { CompanyRepository } from "src/repository";
import { StubDbService } from "src/test/stub/providers";
import { Stub } from "src/test/stub/stub.interface";

export class StubCompanyRepository
  extends CompanyRepository
  implements Stub<CompanyRepository>
{
  constructor() {
    const dbService = new StubDbService();
    super(dbService);
  }
  override create = jest.fn();
  override findById = jest.fn();
  override findByName = jest.fn();
  override findByUserId = jest.fn();
}
