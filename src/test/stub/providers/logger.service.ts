import { LoggerService } from "@providers/logger";
import { Stub } from "src/test/stub/stub.interface";

export class StubLoggerService
  extends LoggerService
  implements Stub<LoggerService>
{
  override error = jest.fn();
  override info = jest.fn();
  override debug = jest.fn();
}
