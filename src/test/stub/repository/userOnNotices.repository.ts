import { UserOnNoticesRepository } from "src/repository";
import { StubDbService, StubUtilsService } from "src/test/stub/providers";
import { Stub } from "src/test/stub/stub.interface";

export class StubUserOnNoticesRepository
  extends UserOnNoticesRepository
  implements Stub<UserOnNoticesRepository>
{
  constructor() {
    const dbService = new StubDbService();
    const utilsService = new StubUtilsService();
    super(dbService, utilsService);
  }
  override bulkCreate = jest.fn();
  override findOne = jest.fn();
  override create = jest.fn();
}
