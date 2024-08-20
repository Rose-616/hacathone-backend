import {User} from '../models/user.model.js'; 
import Notification from '../models/notification.model.js';

import CourseRegistration from '../models/CourseRegistration.model.js'; 
// Controller to get total registrations
const getTotalRegistrations = async (req, res) => {
  try {
    const totalRegistrations = await User.countDocuments();
    res.status(200).json({ totalRegistrations });
  } catch (error) {
    console.error('Error getting total registrations:', error);
    res.status(500).json({ message: 'Server error. Could not get total registrations.' });
  }
};

// Controller to get submitted forms count
const getSubmittedForms = async (req, res) => {
  try {
    const submittedForms = await CourseRegistration.countDocuments();
    res.status(200).json({ submittedForms });
  } catch (error) {
    console.error('Error getting submitted forms:', error);
    res.status(500).json({ message: 'Server error. Could not get submitted forms count.' });
  }
};

// Controller to get accepted applications count
const getPassedApplications = async (req, res) => {
  try {
    const passedApplications = await User.countDocuments({ result: 'pass' });
    res.status(200).json({ passedApplications });
  } catch (error) {
    console.error('Error getting passed applications:', error);
    res.status(500).json({ message: 'Server error. Could not get passed applications count.' });
  }
};

// Controller to get pending applications count
const getfailApplications = async (req, res) => {
  try {
    const failApplications = await User.countDocuments({ result: 'fail' });
    res.status(200).json({ failApplications});
  } catch (error) {
    console.error('Error getting pending applications:', error);
    res.status(500).json({ message: 'Server error. Could not get pending applications count.' });
  }
};









const searchUsers = async (req, res) => {
  const { query } = req.query;
  console.log("This is query",query)
  try {
    const students = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error. Could not search users.' });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { studentId, status } = req.body;
console.log("status",status)
  try {
    await User.findByIdAndUpdate(studentId, { result: status });
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const sendNotification = async (req, res) => {
  const { message } = req.body;

  if (!message ) {
    return res.status(400).json({ error: 'Notification message is required' });
  }

  try {
    const newNotification = new Notification({
      message,
      
    });

    await newNotification.save();

    res.status(200).json({ success: true, message: 'Notification saved successfully' });
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ error: 'Failed to save notification' });
  }
};





export {
  getTotalRegistrations,
  getSubmittedForms,
  getPassedApplications,
  getfailApplications,
  searchUsers,
  updateApplicationStatus,
  sendNotification
};
