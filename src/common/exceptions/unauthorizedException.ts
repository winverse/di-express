import { HttpException } from 'src/common/exceptions/httpException';

export class UnauthorizedException extends HttpException {
  constructor(description = 'Unauthorized') {
    super(description, 401);
  }
}
