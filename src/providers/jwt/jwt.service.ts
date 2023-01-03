import { injectable } from 'tsyringe';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ConfigService } from '@providers/config';

@injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}
  signToken(payload: any, options?: SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const { app, jwt: jwtConfig } = this.configService.get();
      const apiHost = app.host;
      const jwtOptions: SignOptions = {
        ...options,
        issuer: apiHost,
      };
      jwt.sign(payload, jwtConfig.jwtSecretKey, jwtOptions, (error, token) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(token as string);
      });
    });
  }
  decodedToken<T extends jwt.JwtPayload>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const { jwt: jwtConfig } = this.configService.get();
      jwt.verify(token, jwtConfig.jwtSecretKey, (error, decoded) => {
        if (error) {
          reject(error);
          return;
        }
        if (!decoded) {
          throw new Error('Decoded data is undefined');
        }
        resolve(decoded as T);
      });
    });
  }
}
