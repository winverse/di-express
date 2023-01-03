export const config = {
  app: {
    host: "http://localhost", // default url
    port: 8080, // port
  },
  db: {
    provider: "postgres",
    host: "localhost",
    database: "di_express",
    username: "postgres",
    password: "",
  },
  jwt: {
    // Random hex from openssl
    jwtSecretKey:
      "4f05b5ecc32dc04ecd614725052d620a32cf258b56de22a6ca7f3c3fb852bce5",
    cookieSecretKey:
      "b301cf78f07de598da9b6a07d8ffa7aa9e0a494d20425430da58833438332e80",
    accessTokenMaxAge: 60 * 5,
    refreshTokenMaxAge: 60 * 60 * 24 * 7,
  },
};
