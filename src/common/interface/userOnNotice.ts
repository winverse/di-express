import { Notice, User } from "src/common/interface";

export type UserOnNoticeBuildArgs = {
  userId: string;
  noticeId: string;
};

export interface UserOnNotice {
  id: string;
  userId: string;
  noticeId: string;
  registeredAt: string;
  user?: User;
  notice?: Notice;
}

export type UserOnNoticeCreateInputArgs = {
  id: string;
  userId: string;
  noticeId: string;
};

export type UserOnNoticesFindOneInputArgs = {
  userId: string;
  noticeId: string;
};
