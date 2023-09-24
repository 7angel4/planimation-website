module.exports = {
    projects: [
      {
        displayName: "integration-tests", 
        preset: "jest-playwright-preset",
        testRegex: "(/__tests__/.*integration|(\\.|/)(frontend-test|spec))\\.(jsx?|js?|tsx?|ts?)$",
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