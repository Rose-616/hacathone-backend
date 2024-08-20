import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlerware.js"; //for creating protected route
import { Product } from "../models/product.model.js";
import {uploadEcommerce} from "../middlewares/multer.middleware.js"
import   {getTotalRegistrations,getSubmittedForms,  getPassedApplications,getfailApplications,searchUsers,updateApplicationStatus, sendNotification} from "../controllers/admin.controller.js";
import orderController from "../controllers/order.controller.js";
import { Order } from "../models/order.model.js";


const adminRouter = Router();

  // Route to get total registrations
adminRouter.route('/total-registrations').get(
  verifyJWT, // Verify JWT token for authentication
  getTotalRegistrations // Controller function to get total registrations
);

// Route to get submitted forms count
adminRouter.route('/submitted-forms').get(
 
  verifyJWT, // Verify JWT token for authentication
  getSubmittedForms // Controller function to get submitted forms count
);

// Route to get accepted applications count
adminRouter.route('/passed-applications').get(
  verifyJWT, // Verify JWT token for authentication
  getPassedApplications // Controller function to get accepted applications count
);

// Route to get pending applications count
// adminRouter.route('/pending-applications').get(
//   verifyJWT, // Verify JWT token for authentication
//   getPendingApplications // Controller function to get pending applications count
// );




adminRouter.route('/fail-applications').get(
  verifyJWT, // Verify JWT token for authentication
  getfailApplications // Controller function to get pending applications count
);

adminRouter.route('/search-users').get(
  verifyJWT, // Verify JWT token for authentication
  searchUsers// Controller function to get pending applications count
);

adminRouter.route('/update-application-status').post(
  verifyJWT, // Verify JWT token for authentication
  updateApplicationStatus// Controller function to get pending applications count
);


adminRouter.route('/notifications').post(
  verifyJWT, // Verify JWT token for authentication
  sendNotification// Controller function to get pending applications count
);









export default adminRouter;