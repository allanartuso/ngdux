import { spawn } from 'child_process';

// Get the list of files from lint-staged
const files = process.argv.slice(2);
let progress = 0;

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

  if (errors.length > 0) {
    process.exit(1);
  }

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
