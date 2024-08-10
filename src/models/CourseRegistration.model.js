import mongoose from 'mongoose';

const courseRegistrationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  lastQualification: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);

export default CourseRegistration;
