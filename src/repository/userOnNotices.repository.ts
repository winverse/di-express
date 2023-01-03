import { DbService } from "@providers/db";
import { UtilsService } from "@providers/utils";
import {
  UserOnNoticeCreateInputArgs,
  UserOnNoticesFindOneInputArgs,
} from "src/common/interface";
import { UserOnNotices } from "src/entity";
import { injectable } from "tsyringe";

@injectable()
export class UserOnNoticesRepository {
  constructor(
    private readonly dbService: DbService,
    private readonly utilsService: UtilsService,
  ) {}
  async bulkCreate(registerInformation: UserOnNoticesFindOneInputArgs[]) {
    try {
      const values =
        this.utilsService.rawSqlForBulkInsertValues(registerInformation);
      const sql = `
        INSERT INTO public."UserOnNotices"
        ("id", "userId", "noticeId")
        VALUES ${values} RETURNING *
      `;

      const queryResult = await this.dbService.query<UserOnNotices>(sql);

      return queryResult.rows;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async create({ id, userId, noticeId }: UserOnNoticeCreateInputArgs) {
    try {
      const sql = `
        INSERT INTO public."UserOnNotices"
        ("id", "userId", "noticeId")
        VALUES ($1, $2, $3) RETURNING *
      `;

      const values = [id, userId, noticeId];
      const queryResult = await this.dbService.query<UserOnNotices>(
        sql,
        values,
      );

      return queryResult.rows;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findOne({ userId, noticeId }: UserOnNoticesFindOneInputArgs) {
    try {
      const sql = `
        SELECT * FROM public."UserOnNotices"
        WHERE "userId" = $1 AND "noticeId" = $2;
      `;
      const values = [userId, noticeId];
      const queryResult = await this.dbService.query<UserOnNotices>(
        sql,
        values,
      );

      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
}
