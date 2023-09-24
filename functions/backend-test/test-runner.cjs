const { spawnSync } = require('child_process');

// Define the order of project execution
const projectOrder = ['database-tests', 'integration-tests'];

// Iterate over projects and run Jest
for (const projectName of projectOrder) {
  console.log(`\nRunning tests for ${projectName}...`);

  // Define the Jest command for the project
  const jestCommand = `npx jest --config=./functions/backend-test/${projectName}.jest.config.cjs --runInBand --detectOpenHandles --forceExit`;

  // Run Jest for the project
  const result = spawnSync(jestCommand, { shell: true, stdio: 'inherit' });

  if (result.error) {
    console.error(`Error running tests for ${projectName}:`, result.error);
    process.exit(1);
  }
}

console.log('All tests completed.');
