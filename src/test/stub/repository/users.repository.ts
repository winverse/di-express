import { UsersRepository } from "src/repository";
import { mockLoggedUserData } from "src/test/mock/users";
import { StubDbService } from "src/test/stub/providers";
import { Stub } from "src/test/stub/stub.interface";

export class StubUserRepository
  extends UsersRepository
  implements Stub<UsersRepository>
{
  constructor() {
    const dbService = new StubDbService();
    super(dbService);
  }
  override create = jest.fn();
  override findByEmail = jest.fn();
  override findById = jest.fn();
  override loggedUserData = jest.fn().mockResolvedValue(mockLoggedUserData);
  override withdrawal = jest.fn();
}
