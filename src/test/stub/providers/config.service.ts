import { ConfigService } from "@providers/config";
import { mockConfig } from "src/test/mock";
import { StubUtilsService } from "src/test/stub/providers";
import { Stub } from "src/test/stub/stub.interface";

export class StubConfigService
  extends ConfigService
  implements Stub<ConfigService>
{
  constructor() {
    const utilsService = new StubUtilsService();
    super(utilsService);
  }
  override validate = jest.fn();
  override get = jest.fn().mockImplementation(() => ({ ...mockConfig }));
}
