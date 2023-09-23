module.exports = {
  projects: [
    {
      displayName: "backend-tests",
      testEnvironment: 'node',
      testRegex: "(/__tests__/.*backend|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$",
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


