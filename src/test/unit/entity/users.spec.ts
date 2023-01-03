import { Users } from "src/entity";
import { mockUserBuildArgs } from "src/test/mock/users";

describe("Users Entity", () => {
  it("Build", () => {
    const { email, username } = mockUserBuildArgs;
    const user = Users.build({
      email,
      username,
    });

    expect(user).toHaveProperty("id", user.id);
    expect(user).toHaveProperty("email", email);
    expect(user).toHaveProperty("username", username);
  });
});
