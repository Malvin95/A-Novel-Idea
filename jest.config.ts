import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  testMatch: ["**.test.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json"
      }
    ]
  },
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  clearMocks: true
};

export default config;

