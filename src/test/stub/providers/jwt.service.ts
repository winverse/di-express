import { JwtService } from "@providers/jwt";
import { StubConfigService } from "src/test/stub/providers/config.service";

export class StubJwtService extends JwtService {
  constructor() {
    const configService = new StubConfigService();
    super(configService);
  }
  override signToken = jest.fn();
  override decodedToken = jest.fn();
}
