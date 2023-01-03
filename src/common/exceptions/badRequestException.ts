import { HttpException } from 'src/common/exceptions';

export class BadRequestException extends HttpException {
  constructor(description = 'BAD_REQUEST') {
    super(description, 400);
  }
}
