/* eslint-disable @typescript-eslint/no-var-requires */
const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest");
import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  preset: "ts-jest",
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: ["node_modules", "dist"],
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
  rootDir: "./",
  modulePaths: ["./"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default config;
