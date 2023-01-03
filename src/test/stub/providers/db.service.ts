import { DbService } from "@providers/db";
import { StubConfigService } from "src/test/stub/providers";
import { StubLoggerService } from "src/test/stub/providers/logger.service";
import { Stub } from "src/test/stub/stub.interface";

export class StubDbService extends DbService implements Stub<DbService> {
  constructor() {
    const configService = new StubConfigService();
    const loggerService = new StubLoggerService();
    super(configService, loggerService);
  }
  override pool = jest.fn() as any;
  override query = jest.fn();
  override connect = jest.fn();
  override disconnect = jest.fn();
}
