import cuid from "cuid";
import {
  Notice,
  User,
  UserOnNotice,
  UserOnNoticeBuildArgs,
} from "src/common/interface";

export class UserOnNotices implements UserOnNotice {
  id: string;
  userId: string;
  noticeId: string;
  registeredAt: string;
  user?: User;
  notice?: Notice;

  static build({ userId, noticeId }: UserOnNoticeBuildArgs) {
    const usersOnNotices = new UserOnNotices();
    usersOnNotices.id = cuid();
    usersOnNotices.userId = userId;
    usersOnNotices.noticeId = noticeId;
    return usersOnNotices;
  }
}
