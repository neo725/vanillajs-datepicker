import fs from 'fs';
import rootDir from './lib/rootDir.js';

const srcDir = `${rootDir}/js/i18n/locales`;
const distDir = `${rootDir}/dist/js/locales`;

// const reConvert = /export default (\{\s+)([\w'-]+):([\s\S]+\})\n\};/m;
// 修正後的正規表達式：
// 1. 確保匹配單引號 '
// 2. 捕獲 'zh-TW' 內部的 zh-TW 作為 $2
const reConvert = /export default (\{\s+)'([\w-]+)':([\s\S]+?)\n\};/m;
const rePropNameFix = /\.('\w+-\w+')/;

if (fs.existsSync(distDir)) {
  // empty dist dir
  fs.readdirSync(distDir).forEach((file) => {
    fs.unlinkSync(`${distDir}/${file}`);
  });
} else {
  fs.mkdirSync(distDir, {recursive: true});
}
// // copy locales to dist
// fs.readdirSync(srcDir).forEach((file) => {
//   const src = fs.readFileSync(`${srcDir}/${file}`, 'utf8');
//   const output = src
//     .replace(reConvert, '(function () $1Datepicker.locales.$2 =$3;\n}());')
//     .replace(rePropNameFix, '[$1]');
//   fs.writeFileSync(`${distDir}/${file}`, output);
// });
// copy locales to dist
fs.readdirSync(srcDir).forEach((file) => {
  const src = fs.readFileSync(`${srcDir}/${file}`, 'utf8');
  // 這裡的替換字串 (function () $1Datepicker.locales.$2 =$3;\n}());' 不變
  const output = src
    .replace(reConvert, '(function () $1Datepicker.locales\[\'$2\'\] =$3;\n}());')
    .replace(rePropNameFix, '[$1]');
  fs.writeFileSync(`${distDir}/${file}`, output);
});
