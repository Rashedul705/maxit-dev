import dbConnect from './src/lib/mongodb';
import mongoose from 'mongoose';

const checkDatabase = async () => {
  await dbConnect();
  
  let found = 0;
  
  // Get all models
  const models = mongoose.models;
  
  for (const modelName in models) {
    const Model = models[modelName];
    const docs = await Model.find();
    
    for (const doc of docs) {
      const obj = doc.toObject();
      const stringified = JSON.stringify(obj);
      // Look for Maxit, MaxIT, MAXIT but ignore Max iT, admin@maxit.com, @maxitsolution
      const matches = stringified.match(/Maxit|MaxIT|MAXIT/g);
      
      if (matches) {
        // filter out valid matches
        const invalidMatches = matches.filter(m => {
          // We need to look at context, it's easier to just print the matches and manual review
          return true;
        });
        
        if (invalidMatches.length > 0) {
          console.log(`Found in Model: ${modelName}, Doc ID: ${doc._id}`);
          // Extract context
          const idx = stringified.toLowerCase().indexOf('maxit');
          console.log(stringified.substring(Math.max(0, idx - 30), Math.min(stringified.length, idx + 30)));
          found++;
        }
      }
    }
  }

  console.log(`\nScan complete. Found ${found} potential issues.`);
  process.exit(0);
};

checkDatabase();
