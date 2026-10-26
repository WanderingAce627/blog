#!/usr/bin/env node
/**
 * 一键发布：构建 → 把 dist 推到 gh-pages 分支 → GitHub Pages 自动更新。
 * 用法：npm run deploy
 *
 * 这条路不需要 GitHub Actions 权限，也不需要改动任何配置。
 * 如果你已经在仓库里启用了 Actions 自动部署，就不必跑这个脚本。
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(root, 'node_modules', '.cache', 'gh-pages');
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

console.log('\n▸ 1/3 构建静态文件');
run('npm run build', root);

console.log('▸ 2/3 整理发布目录');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
cpSync(path.join(root, 'dist'), tmp, { recursive: true });
// 让 GitHub Pages 跳过 Jekyll —— 否则 _astro 这种下划线开头的目录会被忽略
writeFileSync(path.join(tmp, '.nojekyll'), '');

const remote = execSync('git config --get remote.origin.url', { cwd: root }).toString().trim();
if (!remote) {
  console.error('✗ 找不到远程仓库，请先执行：git remote add origin <你的仓库地址>');
  process.exit(1);
}

console.log('▸ 3/3 推送到 gh-pages');
const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
run('git init -q -b gh-pages', tmp);
run('git add -A', tmp);
run(`git commit -q -m "deploy: ${stamp}"`, tmp);
run(`git remote add origin ${remote}`, tmp);
run('git push -q -f origin gh-pages', tmp);

console.log('\n✓ 发布完成，大约 1 分钟后生效。');
console.log('  仓库：' + remote.replace(/\.git$/, ''));
