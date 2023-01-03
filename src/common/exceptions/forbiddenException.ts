import { HttpException } from 'src/common/exceptions';

export class ForbiddenException extends HttpException {
  constructor(description = 'FORBIDDEN') {
    super(description, 403);
  }
}
