import { User } from "src/common/interface";

type JwtDefault = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
};

export type AccessTokenDecoded = {
  user: User;
} & JwtDefault;

export type RefreshTokenDecoded = { user: { id: string } } & JwtDefault;

export type JwtToken = {
  accessToken: string;
  refreshToken: string;
};
