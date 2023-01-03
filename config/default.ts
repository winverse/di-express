export const config = {
  app: {
    host: "http://localhost", // default url
    port: 8080, // port
  },
  db: {
    provider: "postgres",
    host: "",
    database: "",
    username: "",
    password: "",
  },
  jwt: {
    // Random hex from openssl
    jwtSecretKey: "",
    cookieSecretKey: "",
    accessTokenMaxAge: 60 * 5,
    refreshTokenMaxAge: 60 * 60 * 24 * 7,
  },
};
