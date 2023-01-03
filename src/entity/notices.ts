import cuid from "cuid";
import { Companies } from "src/entity/companies";
import {
  Notice,
  NoticesBuildArgs,
  NoticesCategory,
  User,
} from "src/common/interface";

export class Notices implements Notice {
  id: string;
  title: string;
  description: string;
  category: NoticesCategory;
  companyId: string;
  company: Companies;
  isPublished: boolean;
  isDeleted: boolean;
  applicants?: User[];
  createdAt: string;
  updatedAt: string;

  static build({ title, description, category, companyId }: NoticesBuildArgs) {
    const notice = new Notices();
    notice.id = cuid();
    notice.title = title;
    notice.description = description;
    notice.category = category;
    notice.companyId = companyId;
    return notice;
  }
}

type NoticeApplicant = {
  username: string;
  registeredAt: string;
};

export type NoticeParseResult = {
  id: string;
  title: string;
  category: NoticesCategory;
  description: string;
  companyName: string;
  applicantCount: number;
  applicantIds: string[];
  applicants: NoticeApplicant[];
  createdAt: string;
  updatedAt: string;
};
