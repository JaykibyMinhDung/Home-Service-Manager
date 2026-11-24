// Xuất mỗi màn trong screens.js thành một ảnh PNG trong documents/giao-dien.
// Chạy từ thư mục gốc dự án:  node documents/giao-dien/mockup/xuat-anh.mjs
// Chỉ xuất vài màn:           node documents/giao-dien/mockup/xuat-anh.mjs 05-dat-dich-vu 15-thong-ke
// Cần Microsoft Edge hoặc Google Chrome, và đã chạy npm install trong frontend.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WIDTH = 1280;
const mockupDir = dirname(fileURLToPath(import.meta.url));
const outputDir = dirname(mockupDir);

const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((path) => existsSync(path));
if (!browser) {
  throw new Error('Không tìm thấy Microsoft Edge hoặc Google Chrome.');
}

// Nạp components.js và screens.js để lấy danh sách màn và chiều cao của từng màn.
globalThis.window = globalThis;
for (const file of ['components.js', 'screens.js']) {
  (0, eval)(readFileSync(join(mockupDir, file), 'utf8'));
}

const wanted = process.argv.slice(2);
const screens = Object.entries(globalThis.SCREENS).filter(
  ([name]) => wanted.length === 0 || wanted.includes(name),
);

const profileDir = mkdtempSync(join(tmpdir(), 'mockup-export-'));
try {
  for (const [name, screen] of screens) {
    const output = join(outputDir, `${name}.png`);
    const url = `${pathToFileURL(join(mockupDir, 'index.html')).href}?s=${name}`;
    execFileSync(
      browser,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--no-first-run',
        '--force-device-scale-factor=1',
        `--user-data-dir=${profileDir}`,
        `--window-size=${WIDTH},${screen.height}`,
        `--screenshot=${output}`,
        url,
      ],
      { stdio: 'ignore' },
    );
    console.log(`${existsSync(output) ? 'OK  ' : 'LỖI '} ${name}.png`);
  }
} finally {
  rmSync(profileDir, { recursive: true, force: true });
}
