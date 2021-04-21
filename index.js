const glob = require("@actions/glob");
const writeGood = require("write-good");
const core = require("@actions/core");
const fs = require("fs");

/**
 * TODO: Add JSDoc
 */
async function run() {
  try {
    let error = false;

    // TODO: Allow input to override glob pattern.
    const globber = await glob.create("**/*.md");

    for await (const file of globber.globGenerator()) {
      const data = fs.readFileSync(file, "utf-8");
      const suggestions = writeGood(data);
      if (suggestions.length > 0) {
        core.error(JSON.stringify({ file, suggestions }));
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
