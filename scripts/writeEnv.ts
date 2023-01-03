import path from "path";
import fs from "fs";
import { Config } from "@providers/config";

class WriteEnv {
  public async write() {
    const isDev = process.env.NODE_ENV !== "production";
    const envFile = isDev ? "development" : "production";
    const configFilePath = path.resolve(process.cwd(), `config/${envFile}.ts`);

    if (!fs.existsSync(configFilePath)) {
      throw new Error(`Not found [${envFile}.ts] config file`);
    }

    const { config }: { config: Config } = await import(configFilePath);

    // write env
    const { app } = config;

    const envFilePath = path.resolve(process.cwd(), `.env`);

    await fs.writeFileSync(
      envFilePath,
      `PORT=${app.port}
    `.replace(/ /gi, ""),
    );
  }
}

(async function () {
  try {
    const writeEnv = new WriteEnv();

    await writeEnv.write();
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
})();
