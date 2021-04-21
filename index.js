const glob = require("@actions/glob");
const writeGood = require("write-good");
const core = require("@actions/core");

/**
 * TODO: Add JSDoc
 */
async function run() {
  try {
    core.info("Starting Write-Good action.");
    let error = false;

    // TODO: Allow input to override glob pattern.
    const globber = await glob.create("**/*.md");

    for await (const file of globber.globGenerator()) {
      const suggestions = writeGood(file);
      if (suggestions.length > 0) {
        core.error(`File: ${file}`);
        core.error(JSON.stringify(suggestions));
        error = true;
      }
    }

    if (error) {
      core.setFailed("One or more markdown files had an error.");
    } else {
      core.info("Completed successfully.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
