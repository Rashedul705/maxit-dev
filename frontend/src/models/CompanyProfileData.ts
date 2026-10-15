import mongoose from 'mongoose';

const CompanyProfileDataSchema = new mongoose.Schema(
  {
    stats: [
      {
        label: String,
        value: String
      }
    ],
    howWeWork: [
      {
        title: String,
        description: String
      }
    ],
    industries: [
      {
        name: String,
        icon: String
      }
    ],
    capabilities: [String],
    whyChooseUs: [
      {
        title: String,
        description: String,
        icon: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.CompanyProfileData || mongoose.model('CompanyProfileData', CompanyProfileDataSchema);
