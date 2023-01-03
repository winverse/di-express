import { injectable } from "tsyringe";
import { DbService } from "@providers/db";
import { User } from "src/common/interface";

type UserCreateInputArgs = {
  id: string;
  email: string;
  username: string;
};

@injectable()
export class UsersRepository {
  constructor(private readonly dbService: DbService) {}
  async create({ id, email, username }: UserCreateInputArgs): Promise<User> {
    try {
      const sql = `INSERT INTO public."Users" VALUES ($1, $2, $3) RETURNING *`;
      const values = [id, email, username];
      const queryResult = await this.dbService.query<User>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const sql = `SELECT * FROM public."Users" WHERE email = $1 LIMIT 1`;
      const values = [email];
      const queryResult = await this.dbService.query<User>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findById(id: string): Promise<User> {
    try {
      const sql = `SELECT * FROM public."Users" WHERE id = $1 AND email IS NOT NULL`;
      const values = [id];
      const queryResult = await this.dbService.query<User>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async loggedUserData(id: string): Promise<User | undefined> {
    try {
      const getUserSql = `SELECT * FROM public."Users"  WHERE id = $1 AND email IS NOT NULL`;
      const getUserQueryResult = await this.dbService.query(getUserSql, [id]);

      const user = getUserQueryResult.rows[0];

      if (!user) {
        return undefined;
      }

      const getCompaniesSql = `SELECT id, name FROM public."Companies" WHERE "userId" = $1`;

      const getCompaniesQueryResult = await this.dbService.query(
        getCompaniesSql,
        [user.id],
      );

      const company = getCompaniesQueryResult.rows[0] || null;
      const result = {
        ...user,
        company,
      };

      return result;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async withdrawal(userId: string) {
    try {
      // transaction
      await this.dbService.query("BEGIN");
      const values = [userId];
      const updateSql = `UPDATE public."Users" SET email = null WHERE id = $1`;
      await this.dbService.query(updateSql, values);
      const deleteSql = `DELETE FROM public."UserOnNotices" WHERE "userId" = $1`;
      await this.dbService.query(deleteSql, values);
      await this.dbService.query("COMMIT");
    } catch (error) {
      await this.dbService.query("ROLLBACK");
      throw new Error(error as string);
    }
  }
}
