import cuid from "cuid";
import { Notice } from "src/common/interface";
import { CompaniesBuildArgs } from "src/common/interface/company";

export class Companies implements Companies {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  notices?: Notice[];

  static build({ userId, name }: CompaniesBuildArgs): Companies {
    const companies = new Companies();
    companies.id = cuid();
    companies.name = name;
    companies.userId = userId;
    return companies;
  }
}
