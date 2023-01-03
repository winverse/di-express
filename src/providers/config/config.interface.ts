type AppConfig = {
  readonly host: string;
  readonly port: number;
};

type DatabaseConfig = {
  readonly provider: "postgres" | "mysql";
  readonly host: string;
  readonly database: string;
  readonly username: string;
  readonly password: string;
};

export type JWTCofnig = {
  readonly jwtSecretKey: string;
  readonly cookieSecretKey: string;
  readonly accessTokenMaxAge: number;
  readonly refreshTokenMaxAge: number;
};

export type Config = {
  app: AppConfig;
  db: DatabaseConfig;
  jwt: JWTCofnig;
};
