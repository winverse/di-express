type Company = {
  id: string;
  name: string;
};

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      username: string;
      company?: Company | null;
      createdAt: string;
    };
  }
}
