import { exec } from 'child_process';
import { promisify } from 'util';

// Get the list of files from lint-staged
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('No files found to lint.');
  process.exit(1);
} else {
  // Continue with the files provided as arguments
  lintFiles(files);
}

async function lintFiles(fileList: string[]) {
  console.log(`🚀 Starting linting process for ${fileList.length} files`);
  const chunks = createChunks(fileList, 5);
  const totalChunks = chunks.length;
  const startTime = Date.now();

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    const chunkStartTime = Date.now();
    const chunkIndex = index + 1;
    console.log('');
    console.log(`\x1b[36m🚀 Processing chunk ${chunkIndex} of ${totalChunks}\x1b[0m`);
    console.log('');
    await execLintChunk(chunk);
    const chunkTotalTime = Date.now() - chunkStartTime;
    const percentage = (chunkIndex / totalChunks) * 100;

    console.log('');
    console.log(
      `\x1b[34m[██████████] \x1b[0m${chunkIndex} of ${totalChunks} (${percentage.toFixed(2)}%) - ${chunkTotalTime}ms`
    );
  }

  const totalTime = Date.now() - startTime;
  console.log('');
  console.log(`✅ Linting process completed - ${totalTime}ms`);
}

function createChunks(fileList: string[], chunkSize: number) {
  const chunks: string[][] = [];
  for (let i = 0; i < fileList.length; i += chunkSize) {
    chunks.push(fileList.slice(i, i + chunkSize));
  }
  return chunks;
}

async function execLintChunk(files: string[]) {
  // Use Promise.all with timeout handling
  await Promise.all(
    files.map(async file => {
      const startTime = Date.now();

      try {
        const eslintCommand = `npx eslint --fix "${file}"`;

        // Set timeout for 60 seconds per file
        const execPromise = promisify(exec);
        await execPromise(eslintCommand, { timeout: 60000 });

        logProgress(startTime, file);
      } catch (error) {
        console.error(`\x1b[31m❌ Error linting file ${file}: \x1b[0m${error.message}`);
        // Continue processing other files even if one fails
      }
    })
  );
}

// Function to log progress with fancy real-time visualization
function logProgress(startTime: number, file: string): void {
  const elapsed = Date.now() - startTime;
  const percentage = (elapsed / 60000) * 100; // Assuming max 60s per file

  // Create a visual progress bar
  const progressBar = '█'.repeat(Math.floor(percentage / 10)) + '·'.repeat(10 - Math.floor(percentage / 10));

  console.log(`\x1b[32m✅ ${file} - \x1b[36m${elapsed}ms\x1b[0m [\x1b[34m${progressBar}\x1b[0m]`);
}
