import cuid from "cuid";

export const mockId = cuid();

export const mockUserBuildArgs = {
  email: "public.winverse@gmail.com",
  username: "winverse",
};

export const mockUsers = Array(100)
  .fill(0)
  .map((v, index) => {
    return {
      id: cuid(),
      email: `minibot_${index}@gmail.com`,
      username: `채용 지원자_${index}`,
    };
  });

export const mockUser = {
  id: "clafwucwe0000m0cd7mimezd9",
  email: "public.winverse@gmail.com",
  username: "winverse",
  createdAt: "2022-11-14 07:10:26",
};

export const mockLoggedUserData = {
  id: "clafwucwe0000m0cd7mimezd9",
  email: "public.winverse@gmail.com",
  username: "winverse",
  createdAt: "2022-11-14 07:10:26",
  company: { id: "claj4wxlg0000vtcd2qal2smr", name: "openknowl" },
};
