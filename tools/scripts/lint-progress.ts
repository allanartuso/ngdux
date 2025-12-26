import { exec, spawn } from 'child_process';
import { promisify } from 'util';

let progress = 0;
const execPromise = promisify(exec);
start();

async function start() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.error('No files found to lint.');
    process.exit(1);
  } else {
    // Continue with the files provided as arguments
    // Get the list of files from lint-staged and handle unstaged changes
    try {
      console.log('\x1b[36m🚀 Stashing unstaged changes...\x1b[0m');
      execPromise('git stash push -k -u -m "Un-staged changes"');
      console.log('Stashed');
    } catch (error) {
      console.error(`\x1b[31m❌ Failed to stash changes: ${error.message}\x1b[0m`);
      process.exit(1);
    }
    lintChecks(files);
  }
}

async function lintChecks(fileList: string[]) {
  console.log(`🚀 Starting linting process for ${fileList.length} files`);
  const chunks = createChunks(fileList, 5);
  const totalChunks = chunks.length;
  const startTime = Date.now();
  let errors: string[] = [];

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    const chunkStartTime = Date.now();
    const chunkIndex = index + 1;
    console.log('');
    console.log(`\x1b[36m🚀 Processing chunk ${chunkIndex} of ${totalChunks}\x1b[0m`);
    console.log('');
    const chunkErrors = await execLintChunk(chunk);
    errors = [...errors, ...chunkErrors];

    if (chunkErrors.length > 0) {
      chunkErrors.forEach(error => {
        console.log(`\x1b[31m${error}\x1b[0m`);
      });
    }

    const chunkTotalTime = Date.now() - chunkStartTime;
    const percentage = (chunkIndex / totalChunks) * 100;

    console.log('');
    console.log(
      `\x1b[34m[██████████] \x1b[0m${chunkIndex} of ${totalChunks} (${percentage.toFixed(2)}%) - ${chunkTotalTime}ms`
    );
  }

  const totalTime = Date.now() - startTime;
  console.log('reset...');
  await execPromise('git reset --hard');
  console.log('restoring unstaged changes...');
  await execPromise('git stash pop --index');
  console.log('');

  if (errors.length > 0) {
    console.log(`❌ Linting process failed - ${totalTime}ms`);
    process.exit(1);
  }

  console.log(`✅ Linting process completed - ${totalTime}ms`);

  // Apply stashed changes if any were made
}

function createChunks(fileList: string[], chunkSize: number) {
  const chunks: string[][] = [];
  for (let i = 0; i < fileList.length; i += chunkSize) {
    chunks.push(fileList.slice(i, i + chunkSize));
  }
  return chunks;
}

async function execLintChunk(files: string[]): Promise<string[]> {
  const errors: string[] = [];
  progress = 0;
  await Promise.all(
    files.map(async file => {
      try {
        await runEslintWithSpawn(file);
        progress++;
        logProgress(files.length);
        console.log(`\x1b[32m✅ ${file}`);
      } catch (error) {
        progress++;
        logProgress(files.length);
        console.log(`\x1b[32m❌ ${file}`);
        errors.push(`Linting failed for ${file}: \n ${error.message}`);
      }
    })
  );

  return errors;
}

async function runEslintWithSpawn(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let response = '';
    const child = spawn(`npx eslint --fix "${file}"`, {
      shell: true,
      timeout: 60000,
      stdio: 'pipe'
    });

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Timeout exceeded for ${file}`));
    }, 60000);

    // Stream output to parent process
    child.stdout.on('data', data => {
      response = data;
    });

    child.stderr.on('data', data => {
      response = data;
    });

    child.on('error', err => {
      clearTimeout(timer);
      reject(err);
    });

    child.on('exit', code => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(response);
      } else {
        reject(new Error(response));
      }
    });
  });
}

function logProgress(totalFiles: number): void {
  const percentage = (progress / totalFiles) * 100;
  const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '·'.repeat(20 - Math.floor(percentage / 5));
  process.stdout.write(`\r[\x1b[34m${progressBar}\x1b[0m] `);
}
