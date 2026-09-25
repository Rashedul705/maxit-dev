const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Fix findOne
  if (content.includes('findOne({')) {
    content = content.replace(/findOne\(\{([^}]+)\}\)/g, 'findOne({$1} as any)');
    changed = true;
  }
  
  // Fix find
  if (content.includes('find({')) {
    content = content.replace(/find\(\{([^}]+)\}\)/g, 'find({$1} as any)');
    changed = true;
  }
  
  // Fix findOneAndUpdate
  if (content.includes('findOneAndUpdate({')) {
    content = content.replace(/findOneAndUpdate\(\{([^}]+)\}/g, 'findOneAndUpdate({$1} as any');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
