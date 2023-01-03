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
  // bulk insert 구문에서 사용되는 values 부분 생성
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
  // 객체의 값들 중에서 number로 바꿀 수 있는 값들은 number 타입으로 바꿈
  // nestJS ValidationPipe의 transform 옵션을 영감 받음
  stringToNumber<T>(origin: Record<string, any>): T {
    return Object.keys(origin)
      .filter((key) => !!Number(origin[key]))
      .reduce(
        (acc, key) => Object.assign(acc, { [key]: Number(origin[key]) }),
        { ...origin } as any,
      );
  }
}
