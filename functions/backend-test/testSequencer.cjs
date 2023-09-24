const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const orderedTests = [...tests];
    orderedTests.sort((a, b) => {
      // Run CR_database.js first
      if (a.path.includes('CR_database.js')) {
        return -1; 
      }
      if (b.path.includes('CR_database.js')) {
        return 1; 
      }

      // Run D_database.js last
      if (b.path.includes('D_database.js')) {
        return -1;
      }
      if (a.path.includes('D_database.js')) {
        return 1;
      }

      return 0;
    });
    return orderedTests;
  }
}

module.exports = CustomSequencer;
