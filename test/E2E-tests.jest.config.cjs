module.exports = {
    projects: [
      {
        displayName: "E2E-tests", 
        preset: "jest-playwright-preset",
        testRegex: "(/__tests__/.*e2e|(\\.|/)(frontend-test|spec))\\.(jsx?|js?|tsx?|ts?)$",
        transform: {
          "^.+\\.jsx?$": "babel-jest",
          "^.+\\.mjs$": "babel-jest",
        },
        testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
        moduleFileExtensions: ["js", "jsx", "mjs"],
      }
    ],
    testSequencer: './testSequencer.cjs'
  };