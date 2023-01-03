import { UtilsService } from "@providers/utils";
import { Stub } from "src/test/stub/stub.interface";

export class StubUtilsService
  extends UtilsService
  implements Stub<UtilsService, "mode">
{
  constructor() {
    super();
  }
  override validateSchema = jest.fn();
  override rawSqlForBulkInsertValues = jest.fn();
  override stringToNumber = jest.fn();
}
