import { Router } from "express";
import  {registerForCourse } from '../controllers/CourseRegistration.controller.js'; // Import the course registration controller

import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {uploadAvatar} from '../middlewares/multer.middleware.js';
import { verifyJWT,verifyUserProfile } from "../middlewares/auth.middlerware.js"; //for creating protected route
import adminMiddlerware from "../middlewares/admin.middlerware.js"
import {User} from "../models/user.model.js"; //getting Data from user model file
import bcrypt from "bcrypt"
import Notification from "../models/notification.model.js"; //getting Data from Notificaiton model file

const router = Router()

router.route('/register').post(
  uploadAvatar.single('avatar'), // Use uploadAvatar middleware for single file upload of 'avatar' field
  registerUser
 
);



    router.route("/login").post(loginUser, adminMiddlerware);

    // Inside adminMiddleware
   
    

// secure Routes
router.route("/logout").post(logoutUser)

// Protected route for user profile
router.route("/profile").get(verifyUserProfile, (req, res) => {
    // Access the authenticated user using req.user
    console.log("Profile Route hitted")
    const user = req.user;
  
    // You can render a React component here, or send JSON data
    res.json({ message: 'Profile page', user });
  });


  // , verifyUserProfile,

  router.post('/coursess', (req, res, next) => {
    console.log("Course route hitted"); // Log message to console when the route is accessed
    next(); // Proceed to the registerForCourse controller
  }, registerForCourse);



  router.route('/course').post(
     // Use uploadAvatar middleware for single file upload of 'avatar' field
     
     registerForCourse
   
  );



  router.post('/update-email', verifyUserProfile, async (req, res) => {
    const { email } = req.body;
    const userId = req.user._id; // Use _id to match your database schema
  
    if (!email) {
      return res.status(400).json({ message: 'New email is required' });
    }
  
    try {
      // Check if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
  
      // Check if the new email is different from the current email
      const user = await User.findById(userId);
      if (user.email === email) {
        return res.status(400).json({ message: 'New email must be different from the current email' });
      }
  
      // Update the user's email
      await User.findByIdAndUpdate(userId, { email });
  
      res.json({ message: 'Email updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });


  router.post('/update-password', verifyJWT, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
  
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
  
    try {
      // Retrieve the user's current password from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      // Check if the new password is different from the old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'New password must be different from the current password' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
  
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });




  //Notification Fetching 


router.route('/notifications').get(verifyUserProfile, async (req, res) => {
  try {
    // Fetch notifications from the database
    const notifications = await Notification.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});
  
router.route("/refresh-token").post(refreshAccessToken)

export default router