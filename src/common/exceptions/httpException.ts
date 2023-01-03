export class HttpException extends Error {
  description;
  statusCode;
  constructor(description: string, statusCode: number) {
    super();
    this.description = description;
    this.statusCode = statusCode;
  }
}
