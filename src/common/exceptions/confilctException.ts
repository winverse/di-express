import { HttpException } from 'src/common/exceptions';

export class ConfilctException extends HttpException {
  constructor(description = 'CONFILCT') {
    super(description, 409);
  }
}
