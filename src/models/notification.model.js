import mongoose from 'mongoose';

// Define the notification schema
const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
