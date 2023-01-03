import { NoticeListQueryDto } from "@controllers/v1/notices/dto/noticeListQuery.dto";
import { DbService } from "@providers/db";
import { UtilsService } from "@providers/utils";
import {
  Notice,
  NoticeListRawQueryResult,
  NoticesCategory,
} from "src/common/interface";
import { injectable } from "tsyringe";

type NoticeCreateInputArgs = {
  id: string;
  title: string;
  category: NoticesCategory;
  description: string;
  companyId: string;
};

type NoticeUpdateInputArgs = {
  updatedAt: Date;
} & Omit<NoticeCreateInputArgs, "id" | "companyId">;

type FindByOptions = {
  join: boolean;
};

@injectable()
export class NoticeRepository {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly dbService: DbService,
  ) {}
  async create({
    id,
    title,
    category,
    description,
    companyId,
  }: NoticeCreateInputArgs) {
    try {
      const sql = `
        INSERT INTO public."Notices"
        ("id", "title", "category", "description", "companyId")
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const values = [id, title, category, description, companyId];
      const queryResult = await this.dbService.query<Notice>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async bulkCreate(notices: NoticeCreateInputArgs[]) {
    try {
      const values = this.utilsService.rawSqlForBulkInsertValues(notices);
      const sql = `
      INSERT INTO public."Notices"
      ("id", "title", "description", "category", "companyId")
      VALUES ${values} RETURNING *`;

      const queryResult = await this.dbService.query<Notice>(sql);
      return queryResult.rows;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findByTitle(title: string) {
    try {
      const sql = `SELECT * FROM public."Notices" WHERE title = $1`;
      const values = [title];
      const queryResult = await this.dbService.query<Notice>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findById(noticeId: string, options?: FindByOptions): Promise<Notice> {
    try {
      const option: FindByOptions = options || { join: false };
      const sql = `SELECT * FROM public."Notices" WHERE id = $1`;
      const values = [noticeId];
      const queryResult = await this.dbService.query<Notice>(sql, values);
      const notice = queryResult.rows[0];

      if (!option.join) {
        return notice;
      }

      // 지원자 정보와 함께 데이터를 불러올때
      const joinSql = `
        SELECT u.id, u.username, u.email, u."createdAt"
        FROM public."UserOnNotices" as uol
          INNER JOIN public."Users" as u
          ON uol."userId" = u."id"
        WHERE uol."noticeId" = $1 AND u."email" IS NOT NULL`;

      const joinSqlQueryResult = await this.dbService.query(joinSql, values);
      return {
        ...notice,
        students: joinSqlQueryResult.rows,
      };
    } catch (error) {
      throw new Error(error as any);
    }
  }

  async update(notice: NoticeUpdateInputArgs, noticeId: string) {
    try {
      const { title, category, description, updatedAt } = notice;
      const sql = `UPDATE public."Notices" 
      SET title = $1, category = $2, description = $3, "updatedAt" = $4
      WHERE id = \'${noticeId}\' RETURNING *`;
      const values = [title, category, description, updatedAt];
      const queryResult = await this.dbService.query<Notice>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async setPublish(isPublished: boolean, noticeId: string) {
    try {
      const sql = `
        UPDATE public."Notices"
        SET "isPublished" = $1
        WHERE id = \'${noticeId}\' RETURNING *`;
      const values = [isPublished];
      const queryResult = await this.dbService.query<Notice>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async list(query: Partial<NoticeListQueryDto>) {
    try {
      const { category, keyword } = query;
      let sql = `
    SELECT 
      le.id, le.title, le.description, le.category, le."isDeleted", le."createdAt", le."updatedAt",
      uol."registeredAt",
      u.id as "userId", u."username", u."email" as "userEmail",
      ins."name" as "companyName"
    FROM "Notices" as le
      LEFT JOIN "UserOnNotices" as uol ON uol."noticeId" = le."id"
      LEFT JOIN "Companies" as ins ON ins."id" = le."companyId" 
      LEFT JOIN "Users" as u ON u."id" = uol."userId"
    WHERE le."isDeleted" = false AND le."isPublished" = true `;

      let whereQuery = "";

      if (category !== "all") {
        whereQuery = whereQuery.concat(`AND le."category" = '${category}' `);
      }

      if (keyword) {
        whereQuery = whereQuery.concat(`AND `);
        whereQuery = whereQuery.concat(
          `le."title" LIKE '%${keyword}%' OR ins."name" LIKE '%${keyword}%'`,
        );
      }

      if (category !== "all" || keyword) {
        sql = sql.concat(whereQuery);
      }

      const queryResult = await this.dbService.query<NoticeListRawQueryResult>(
        sql,
      );

      return queryResult.rows;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async detail(noticeId: string) {
    try {
      const sql = `
        SELECT 
          le.id, le.title, le.description, le.category, le."isDeleted", le."createdAt", le."updatedAt",
          uol."registeredAt",
          u.id as "userId", u."username", u."email" as "userEmail",
          ins."name" as "companyName"
        FROM "Notices" as le
          LEFT JOIN "UserOnNotices" as uol ON uol."noticeId" = le."id"
          LEFT JOIN "Companies" as ins ON ins."id" = le."companyId" 
          LEFT JOIN "Users" as u ON u."id" = uol."userId"
        WHERE u.username IS NOT NULL AND le."isDeleted" = false AND le."id" = $1`;
      const values = [noticeId];
      const queryResult = await this.dbService.query<NoticeListRawQueryResult>(
        sql,
        values,
      );
      return queryResult.rows;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async delete(noticeId: string) {
    try {
      const sql = `
        UPDATE public."Notices" SET "isDeleted" = true WHERE id = $1 RETURNING *
      `;
      const values = [noticeId];
      const queryResult = await this.dbService.query<NoticeListRawQueryResult>(
        sql,
        values,
      );

      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
}
