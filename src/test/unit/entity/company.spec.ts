import { Companies, Users } from "src/entity";
import { mockUserBuildArgs } from "src/test/mock/users";

describe("Companies Entity", () => {
  it("Build", () => {
    const { email, username } = mockUserBuildArgs;
    const user = Users.build({ email, username });

    const company = Companies.build({
      userId: user.id,
      name: "오픈놀",
    });

    expect(company).toHaveProperty("id", company.id);
    expect(company).toHaveProperty("name", company.name);
    expect(company).toHaveProperty("userId", company.userId);
  });
});
