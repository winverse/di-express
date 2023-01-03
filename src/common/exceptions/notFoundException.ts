import { HttpException } from 'src/common/exceptions';

export class NotFoundException extends HttpException {
  constructor(description = 'NOT_FOUND') {
    super(description, 404);
  }
}
