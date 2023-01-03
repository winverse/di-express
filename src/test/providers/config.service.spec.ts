import { ConfigService } from "@providers/config/config.service";
import { container } from "tsyringe";
import { config as defaultConfig } from "@config/default";

describe("Config service", () => {
  const configService = container.resolve(ConfigService);
  it("Should return config object", () => {
    const config = configService.get();

    const configKeys = Object.keys(config);
    const defaultConfigKeys = Object.keys(defaultConfig);

    expect(configKeys).toEqual(defaultConfigKeys);
  });
});
