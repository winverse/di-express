import { DbService } from "@providers/db";
import { Company, CompanyCreateInputArgs } from "src/common/interface";
import { injectable } from "tsyringe";

@injectable()
export class CompanyRepository {
  constructor(private readonly dbService: DbService) {}
  async create({ id, name, userId }: CompanyCreateInputArgs): Promise<Company> {
    try {
      const sql = `INSERT INTO public."Companies" VALUES ($1, $2, $3) RETURNING *`;
      const values = [id, name, userId];
      const queryResult = await this.dbService.query<Company>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findById(id: string): Promise<Company> {
    try {
      const sql = `SELECT * FROM public."Companies" WHERE id = $1`;
      const values = [id];
      const queryResult = await this.dbService.query<Company>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findByUserId(userId: string) {
    try {
      const sql = `SELECT * FROM public."Companies" WHERE "userId" = $1`;
      const values = [userId];
      const queryResult = await this.dbService.query<Company>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
  async findByName(name: string): Promise<Company | undefined> {
    try {
      const sql = `SELECT * FROM public."Companies" WHERE name = $1`;
      const values = [name];
      const queryResult = await this.dbService.query<Company>(sql, values);
      return queryResult.rows[0];
    } catch (error) {
      throw new Error(error as any);
    }
  }
}
