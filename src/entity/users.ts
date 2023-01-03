import cuid from "cuid";
import { Company, User, UserBuildArgs } from "src/common/interface";

export class Users implements User {
  id: string;
  email: string;
  username: string;
  company?: Company | null;
  createdAt: string;

  static build({ email, username }: UserBuildArgs): User {
    const user = new Users();
    user.id = cuid();
    user.email = email;
    user.username = username;
    return user;
  }
}
