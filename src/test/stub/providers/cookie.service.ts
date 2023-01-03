import { CookiesService } from "@providers/cookie";
import { Stub } from "src/test/stub/stub.interface";

export class StubCookieService
  extends CookiesService
  implements Stub<CookiesService>
{
  override setCookie = jest.fn();
  override getCookie = jest.fn();
  override clearCookie = jest.fn();
}
