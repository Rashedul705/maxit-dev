import mongoose from 'mongoose';

const GlobalContactSchema = new mongoose.Schema(
  {
    addressLine1: {
      type: String,
      default: 'Afroza Tower, 4th Floor,',
    },
    addressLine2: {
      type: String,
      default: 'Uposhohor Newmarket,',
    },
    addressLine3: {
      type: String,
      default: 'Rajshahi-6000',
    },
    phoneNumber: {
      type: String,
      default: '+88 01733-272445',
    },
    whatsappNumber: {
      type: String,
      default: '01733272445',
    },
    email: {
      type: String,
      default: 'sales@m4xit.com',
    },
    facebookUrl: {
      type: String,
      default: '#',
    },
    linkedinUrl: {
      type: String,
      default: '#',
    },
    githubUrl: {
      type: String,
      default: '#',
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.app.goo.gl/2N1mLA8RwpcaohFs6',
    },
    googleMapsEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1816.9782315667!2d88.5978931!3d24.3776999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14644734df7254d%3A0x9ca140a46bae1fa1!2sMax%20iT%20Solution!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd',
    }
  },
  { timestamps: true }
);

export default mongoose.models.GlobalContact || mongoose.model('GlobalContact', GlobalContactSchema);
