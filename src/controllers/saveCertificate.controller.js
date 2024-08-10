import Certificate from '../models/certificate.model.js';
import {ApiError} from "../utils/ApiError.js";
// import magicCertificate from 'magic-certificate';


const saveCertificate = async (req, res) => {
  const { studentName, courseTitle, rollNumber, cnicNumber, emailAddress } = req.body;

  // Validate required fields (if needed)
  if (!studentName || !courseTitle || !rollNumber|| !cnicNumber|| !emailAddress) {
    // If required fields are missing, return a 400 error
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newCertificate = new Certificate({
      studentName,
      courseTitle,
      rollNumber,
      cnicNumber,
      emailAddress
    });

    // Save the certificate
    await newCertificate.save();

    // Respond with success message
    res.status(201).json({ message: 'Certificate data saved successfully' });
  } catch (error) {
    if (error instanceof ApiError) {
      // Custom error handling with specific status codes
      res.status(error.statusCode).json({ message: error.message });
    } else {
      // General error handling
      console.error('Error saving certificate:', error);
      res.status(500).json({ message: 'Failed to save certificate data', error });
    }
  }
};

// const generateCertificate = async (req, res) => {
//   try {
//     const { recipientName, courseName, completionDate } = req.body;

//     // Example usage of magic-certificate package
//     const generatedCertificate = await magicCertificate.generate({
//       recipientName,
//       courseName,
//       completionDate,
//       // Additional options as per the package's API
//     });

//     // Assuming the package returns a generated certificate data or file

//     // Return success response
//     res.status(200).json({ success: true, certificate: generatedCertificate });
//   } catch (error) {
//     // Handle errors
//     console.error('Error generating certificate:', error);
//     res.status(500).json({ success: false, error: 'Error generating certificate' });
//   }
// };
 const getStudentByRollNumber = async (req, res) => {
  const { rollNumber } = req.params;

  try {
    const student = await Certificate.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



const transferCertificate = async (req, res) => {
  const { rollNumber } = req.body; // Get rollNumber from request body
  console.log("Route Hitted of Transfer Certificate", rollNumber);

  try {
    const student = await Certificate.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyCertificate = async (req, res) => {
  const { certificateId } = req.params;
  console.log("Received certificateId:", certificateId);

  try {
    const certificate = await Certificate.findOne({ certificateId: certificateId });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};





export {saveCertificate,
  getStudentByRollNumber,
  verifyCertificate,
  transferCertificate,
  // generateCertificate,
};
