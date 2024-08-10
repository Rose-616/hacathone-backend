import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const certificateSchema = new Schema({
  studentName: { type: String, required: true },
  courseTitle: { type: String, required: true },
  rollNumber: { type: String, required: true },
  cnicNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  date: { type: Date, default: Date.now },
  generateCertificate: { type: Boolean, default: true },
  certificateId: { type: String, default: uuidv4 }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
