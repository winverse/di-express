export interface User {
  id: string;
  email: string;
  username: string;
  company?: Company | null;
  createdAt: string;
}

export type UserBuildArgs = {
  email: string;
  username: string;
};
