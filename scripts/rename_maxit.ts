import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const searchDir = path.join(process.cwd(), 'src');
const files = globSync('**/*.{ts,tsx,css}', { cwd: searchDir, absolute: true });

const ignorePatterns = [
  'admin@maxit.com',
  '@maxitsolution',
  'MaxIT_Company_Profile.pdf',
  '/MaxIT_Company_Profile.pdf'
];

let totalReplaced = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;
  
  // Find all matches of Maxit, MaxIT, MAXIT, maxit
  // But be careful around ignored patterns.
  // A safe regex: /(?<!admin@)(?<!@)MaxIT(?!=_Company_Profile\.pdf)/gi
  
  // Actually, we can just replace all \b(MaxIT|MAXIT|Maxit|maxit)\b
  // and then revert the ones we know we shouldn't have changed.
  
  content = content.replace(/\b(MaxIT|MAXIT|Maxit)\b/g, 'Max iT');
  
  // Revert ignored ones
  content = content.replace(/Max iT_Company_Profile\.pdf/g, 'MaxIT_Company_Profile.pdf');
  content = content.replace(/admin@Max iT\.com/g, 'admin@maxit.com');
  content = content.replace(/@Max iTsolution/g, '@maxitsolution');
  
  // We can also check if we replaced anything
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    totalReplaced++;
    console.log(`Updated: ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`Done! Replaced in ${totalReplaced} files.`);
