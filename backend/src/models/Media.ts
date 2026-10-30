import mongoose, { Model } from 'mongoose';

export interface IMedia {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
}

const MediaSchema = new mongoose.Schema<IMedia>(
  {
    filename: {
      type: String,
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      required: true,
      default: 'image/jpeg',
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

const Media: Model<IMedia> = (mongoose.models.Media as Model<IMedia>) || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
