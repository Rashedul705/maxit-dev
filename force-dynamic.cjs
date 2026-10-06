const fs = require('fs'); 
const files = [
  'src/app/api/admin/projects/route.ts', 
  'src/app/api/admin/projects/[id]/route.ts', 
  'src/app/api/admin/project-categories/route.ts', 
  'src/app/api/admin/project-categories/[id]/route.ts', 
  'src/app/projects/page.tsx', 
  'src/app/project/[projectName]/page.tsx', 
  'src/app/page.tsx'
]; 
files.forEach(f => { 
  let content = fs.readFileSync(f, 'utf8'); 
  if (!content.includes('export const dynamic')) { 
    content = "export const dynamic = 'force-dynamic';\n" + content; 
    fs.writeFileSync(f, content); 
    console.log('Added to', f); 
  } 
});
