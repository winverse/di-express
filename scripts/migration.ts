import "reflect-metadata";
import { Config } from "@providers/config";
import { Client } from "pg";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { container, injectable } from "tsyringe";
import { DbService } from "@providers/db";
import {
  CompanyRepository,
  NoticeRepository,
  UserOnNoticesRepository,
  UsersRepository,
} from "src/repository";
import { mockNoticeBulkCreateInput, mockUsers } from "src/test/mock";
import cuid from "cuid";

// Only allow development environment
@injectable()
class Migration {
  private randomSelector<T>(target: T[]): T {
    const min = 0;
    const max = target.length - 1;
    const index = Math.floor(Math.random() * (max - min)) + min;
    return target[index];
  }
  private getConfig(): Config {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config } = require("../config/development");
    return config as Config;
  }
  private async getClient() {
    const { db } = this.getConfig();

    const client = new Client({
      user: db.username,
      host: db.host,
      database: db.database,
      password: db.password,
    });

    await client.connect();

    return client;
  }
  async initDatabase() {
    const { db } = this.getConfig();
    try {
      await execSync(`createdb ${db.database}`, {
        encoding: "utf-8",
        stdio: "inherit",
      });

      const client = await this.getClient();
      const createTableSql = await this.sqlFileToString();

      await client.query(createTableSql);
      console.log(`Success init ${db.database} database`);
    } catch (error: any) {
      console.error(error);
      await execSync(`dropdb --if-exists ${db.database}`);
    }
    process.exit(0);
  }

  private sqlFileToString() {
    const initMigrationSqlFilePath = path.resolve(
      process.cwd(),
      "migrations/init.sql",
    );

    const sqlFile = fs.readFileSync(initMigrationSqlFilePath, {
      encoding: "utf-8",
    });

    const removeComments = sqlFile
      .toString()
      .split("\n")
      .filter((line) => line[0] !== "-");

    const sql = removeComments.join("").replace(/\s/g, " ");

    return sql;
  }
  async dropDatabase() {
    try {
      const { db } = this.getConfig();

      await execSync(`dropdb --if-exists ${db.database}`);
      console.log(`Success drop the ${db.database} database`);
    } catch (error: any) {
      console.error(error?.message);
      console.log("=========================================");
      console.info("if being accessd by other users message");
      console.info("run ps -ef | grep postgres");
      console.info("and then run sudo kill -9 PID");
    }
    process.exit(0);
  }
  async createMock() {
    const dbService = container.resolve(DbService);
    await dbService.connect();

    const usersRepository = container.resolve(UsersRepository);
    const companyRepository = container.resolve(CompanyRepository);
    const noticeRepository = container.resolve(NoticeRepository);
    const userOnNoticesRepository = container.resolve(UserOnNoticesRepository);

    const users = await Promise.all(
      mockUsers.map((user) => usersRepository.create(user)),
    );

    const company = this.randomSelector(users);
    const companyId = cuid();
    await companyRepository.create({
      id: companyId,
      name: "openknowl" + cuid().slice(0, 10),
      userId: company.id,
    });

    const notices = await Promise.all(
      mockNoticeBulkCreateInput.notices.map(async (notice) => {
        const data = {
          id: cuid(),
          ...notice,
          companyId,
        };
        return await noticeRepository.create(data);
      }),
    );

    const mockUserOnNotices = Array(1000)
      .fill(0)
      .map(() => ({
        id: cuid(),
        userId: this.randomSelector(users).id,
        noticeId: this.randomSelector(notices).id,
      }));

    await Promise.all(
      mockUserOnNotices.map(async (mock) => {
        const { userId, noticeId } = mock;
        const exists = await userOnNoticesRepository.findOne({
          noticeId,
          userId,
        });
        if (exists) return;

        await userOnNoticesRepository.create({
          id: cuid(),
          userId,
          noticeId,
        });
      }),
    );

    const client = await this.getClient();

    await client.query(`UPDATE public."Notices" SET "isPublished" = true`);

    console.log("Success create mock data");
    process.exit(0);
  }
}

type MigraionArgs = "--init" | "--drop" | "--mock";

(async function () {
  const arg = process.argv[2];

  if (!["--init", "--drop", "--mock"].includes(arg)) {
    throw new Error("Not allow migration arguments");
  }

  const migration = new Migration();

  const argumentsMap: Record<MigraionArgs, () => void> = {
    "--init": () => migration.initDatabase(),
    "--drop": () => migration.dropDatabase(),
    "--mock": () => migration.createMock(),
  };

  await argumentsMap[arg as MigraionArgs]();
})();
