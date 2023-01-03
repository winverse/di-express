import { ConfigService } from "@providers/config";
import { injectable } from "tsyringe";
import { Pool, QueryResult, QueryResultRow } from "pg";
import { LoggerService } from "@providers/logger";

@injectable()
export class DbService {
  pool: Pool;
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.generateClient();
  }
  private generateClient() {
    if (this.pool) return;

    const { db } = this.configService.get();

    const pool = new Pool({
      user: db.username,
      host: db.host,
      database: db.database,
      password: db.password,
    });

    this.pool = pool;
  }

  async query<T extends QueryResultRow = any>(
    sql: string,
    values?: any,
  ): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
      const cb = (err: Error, res: QueryResult<T>) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      };

      if (!values) {
        values = cb;
      }

      this.pool.query<T>(sql, values, cb);
    });
  }

  connect() {
    this.pool
      ?.connect()
      .then(() => {
        this.loggerService.info("Database connection is successful");
      })
      .catch((reason) => {
        this.loggerService.error(`Database connection Failed ${reason}`);
        process.exit(0);
      });
  }

  disconnect() {
    this.pool.end().then(() => {
      console.log("Dataabse disconnected");
    });
  }
}
