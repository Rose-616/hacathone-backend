import { ApiError } from "../utils/ApiError.js";
import CourseRegistration from '../models/CourseRegistration.model.js';

// Function to check for empty fields
const checkEmptyFields = (fields) => {
  return fields.some(field => !field || field.trim() === '');
};

// Controller function to handle course registration
const registerForCourse = async (req, res) => {
  const { studentName, studentEmail, mobileNo, lastQualification } = req.body;

  // Check for empty fields
  if (checkEmptyFields([studentName, studentEmail, mobileNo, lastQualification])) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the student has already registered
    const existingRegistration = await CourseRegistration.findOne({ studentEmail });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You have already registered.' });
    }

    // Create a new registration
    const newRegistration = new CourseRegistration({
      studentName,
      studentEmail,
      mobileNo,
      lastQualification,
    });

    // Save the registration to the database
    await newRegistration.save();

    res.status(201).json({ message: 'Registration successful', data: newRegistration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for the course', error: error.message });
  }
};

// Optional: Controller function to get all registrations (for admin or reporting purposes)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await CourseRegistration.find();
    res.status(200).json({ data: registrations });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving registrations', error: error.message });
  }
};

// Optional: Controller function to get a specific registration by email
const getRegistrationByEmail = async (req, res) => {
  const { studentEmail } = req.params;

  try {
    const registration = await CourseRegistration.findOne({ studentEmail });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.status(200).json({ data: registration });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving registration', error: error.message });
  }
};

export {
  registerForCourse,
  getAllRegistrations, // Optional: If you want to list all registrations
  getRegistrationByEmail, // Optional: If you want to find a registration by email
};
