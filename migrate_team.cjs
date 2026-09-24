const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(process.cwd(), 'data', 'team.json');

const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

data.members = data.members.map(m => {
  return {
    id: m.id,
    name: m.name,
    officialTitle: m.designation || '',
    functionalDesignation: '',
    department: m.department || 'Board of Directors',
    bio: m.description || '',
    image: m.image || '',
    socialLinks: m.socialLinks || {},
    order: m.order || 0
  };
});

if (data.ceo) {
  data.ceo = {
    name: data.ceo.name,
    nickname: data.ceo.nickname,
    officialTitle: data.ceo.designation || '',
    functionalDesignation: '',
    image: data.ceo.image || '',
    message: data.ceo.message || '',
    socialLinks: data.ceo.socialLinks || {}
  };
}

fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
console.log("Team schema migrated successfully!");
