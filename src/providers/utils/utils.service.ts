import { ClassConstructor, plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class UtilsService {
  get mode() {
    const isDev = process.env.NODE_ENV !== "production";
    const isProd = !isDev;

    return {
      isDev,
      isProd,
    };
  }

  async validateSchema(
    res: Response,
    schema: ClassConstructor<any>,
    raw: any,
  ): Promise<boolean> {
    const target = plainToClass(schema, raw);
    try {
      await validateOrReject(target, {
        skipMissingProperties: false,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        whitelist: true,
      });
      return true;
    } catch (error) {
      const errorMessage = this.mode.isDev ? error : "BAD REQUEST";
      res.status(400).send(errorMessage);
      return false;
    }
  }
  // create raw sql for bulk insert
  rawSqlForBulkInsertValues(array: any[]): string {
    const isLast = (index: number, arr: any[]) => index === arr.length - 1;
    const result = array
      .map((data) => Object.values(data))
      .map((data) => {
        const rawSql = data.reduce((s, cur, index, origin) => {
          const sql: string = s + `'${cur}'`;
          if (isLast(index, origin)) {
            return sql.concat(")");
          } else {
            return sql.concat(",");
          }
        }, `(`);
        return rawSql;
      });
    return result.join(",");
  }
  // inspired from nestJS ValidationPipe transform
  stringToNumber<T>(origin: Record<string, any>): T {
    return Object.keys(origin)
      .filter((key) => !!Number(origin[key]))
      .reduce(
        (acc, key) => Object.assign(acc, { [key]: Number(origin[key]) }),
        { ...origin } as any,
      );
  }
}
