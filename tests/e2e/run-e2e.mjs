import nextEnv from '@next/env';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const baseUrl = (
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.BETTER_AUTH_URL ||
  'http://localhost:3000'
).replace(/\/$/, '');
const baseHostname = new URL(baseUrl).hostname;
const nextArgs = [
  'node_modules/next/dist/bin/next',
  'dev',
  '--hostname',
  baseHostname,
];
const playwrightArgs = [
  'node_modules/@playwright/test/cli.js',
  'test',
  ...process.argv.slice(2),
];

async function isServerReady() {
  try {
    const response = await fetch(baseUrl, {
      signal: AbortSignal.timeout(1500),
    });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (await isServerReady()) return;
    await delay(500);
  }

  throw new Error(`Next.js dev server did not become ready at ${baseUrl}`);
}

function spawnNode(args, options = {}) {
  return spawn(process.execPath, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    ...options,
  });
}

async function killProcessTree(child) {
  if (!child?.pid || child.exitCode !== null) return;

  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn(
        'taskkill',
        ['/pid', String(child.pid), '/t', '/f'],
        {
          stdio: 'ignore',
        },
      );
      killer.on('exit', resolve);
      killer.on('error', resolve);
    });
  } else {
    child.kill('SIGTERM');
  }

  child.kill();
  child.unref();
}

async function runPlaywright() {
  return await new Promise((resolve) => {
    const child = spawnNode(playwrightArgs, {
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: baseUrl,
        PLAYWRIGHT_SKIP_WEB_SERVER: '1',
      },
    });
    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

let nextProcess;
let exitCode = 1;
const startedHere = !(await isServerReady());

try {
  if (startedHere) {
    nextProcess = spawnNode(nextArgs, {
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: baseUrl,
      },
    });
    await waitForServer();
  }

  exitCode = await runPlaywright();
} finally {
  if (startedHere) {
    await killProcessTree(nextProcess);
  }
}

process.exit(exitCode);
