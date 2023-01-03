import { Notice } from "src/common/interface/notice";

export interface Company {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  notices?: Notice[];
}

export type CompaniesBuildArgs = {
  name: string;
  userId: string;
};

export type CompanyCreateInputArgs = {
  id: string;
  name: string;
  userId: string;
};
