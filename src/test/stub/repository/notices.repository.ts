import { NoticeRepository } from "src/repository";
import { StubDbService, StubUtilsService } from "src/test/stub/providers";
import { Stub } from "src/test/stub/stub.interface";

export class StubNoticesRepository
  extends NoticeRepository
  implements Stub<NoticeRepository>
{
  constructor() {
    const utilsService = new StubUtilsService();
    const dbService = new StubDbService();
    super(utilsService, dbService);
  }
  override create = jest.fn();
  override bulkCreate = jest.fn();
  override findByTitle = jest.fn();
  override findById = jest.fn();
  override update = jest.fn();
  override setPublish = jest.fn();
  override list = jest.fn();
  override detail = jest.fn();
  override delete = jest.fn();
}
