import dbConnect from './src/lib/mongodb.ts';
import Service from './src/models/Service.ts';

const revertIcons = async () => {
  await dbConnect();
  
  await Service.updateMany({}, { $set: { iconUrl: "" } });
  
  console.log("Reverted all icons to fallback Lucide icons.");
  process.exit(0);
};

revertIcons();
