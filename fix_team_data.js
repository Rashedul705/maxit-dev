const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(process.cwd(), 'data', 'team.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

data.members.forEach(m => {
  if (m.name.includes("Subnom")) {
    m.functionalDesignation = "Chairman";
  } else if (m.name.includes("Zahangir")) {
    m.functionalDesignation = "Founder & Managing Director";
  } else if (m.name.includes("Amaira")) {
    m.functionalDesignation = "Goodwill Ambassador";
  }
});

fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
console.log("Team data updated with functional designations!");
