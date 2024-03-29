import { Company, User } from "src/common/interface";

export type NoticesCategory =
  | "developer"
  | "design"
  | "marketing"
  | "service"
  | "planner";

export const noticesCategory: NoticesCategory[] = [
  "developer",
  "design",
  "marketing",
  "service",
  "planner",
];

export type NoticeOrderBy = "createdAt" | "applicantsCount";

export const noticeOrderBy: NoticeOrderBy[] = ["createdAt", "applicantsCount"];

export type NoticesBuildArgs = {
  title: string;
  description: string;
  category: NoticesCategory;
  companyId: string;
};

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticesCategory;
  companyId: string;
  company?: Company;
  isPublished: boolean;
  isDeleted: boolean;
  applicants?: User[] | null;
  createdAt: string;
  updatedAt: string;
}

export type NoticeListRawQueryResult = {
  id: string;
  title: string;
  description: string;
  category: NoticesCategory;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  registeredAt: string;
  userId: string;
  username: string;
  userEmail: string;
  companyName: string;
};
