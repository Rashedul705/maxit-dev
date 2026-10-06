import dbConnect from './src/lib/mongodb.ts';
import Service from './src/models/Service.ts';

const updateServices = async () => {
  await dbConnect();
  
  const updates = [
    {
      title: "Solar Energy",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
      iconUrl: "https://img.icons8.com/color/96/solar-panel.png"
    },
    {
      title: "Irrigation & Water",
      imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
      iconUrl: "https://img.icons8.com/color/96/watering-can.png"
    },
    {
      title: "IT & Networking",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
      iconUrl: "https://img.icons8.com/color/96/network-cable.png"
    },
    {
      title: "Automation & Civil Works",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      iconUrl: "https://img.icons8.com/color/96/automation.png"
    },
    {
      title: "Power & Electrical",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
      iconUrl: "https://img.icons8.com/color/96/high-voltage.png"
    },
    {
      title: "CCTV Surveillance",
      imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800",
      iconUrl: "https://img.icons8.com/color/96/cctv-camera.png"
    }
  ];

  for (const update of updates) {
    await Service.updateOne(
      { title: update.title },
      { $set: { imageUrl: update.imageUrl, iconUrl: update.iconUrl } }
    );
    console.log(`Updated images for: ${update.title}`);
  }
  
  console.log("Done updating all service images!");
  process.exit(0);
};

updateServices();
