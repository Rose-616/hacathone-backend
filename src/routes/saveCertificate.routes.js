import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {uploadAvatar} from '../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middlerware.js"; //for creating protected route
import adminMiddlerware from "../middlewares/admin.middlerware.js"
import {saveCertificate, getStudentByRollNumber,verifyCertificate,transferCertificate} from "../controllers/saveCertificate.controller.js";
const saveCertificateRouter = Router()



    // Inside adminMiddleware
   
    saveCertificateRouter.route('/hero/std').post(transferCertificate); 
    saveCertificateRouter.route('/students/:certificateId').get(verifyCertificate);
// secure Routes
saveCertificateRouter.route("/save-certificate").post(saveCertificate)
// saveCertificateRouter.route("/magic-certificate").post(generateCertificate)
saveCertificateRouter.route('/student/:rollNumber').get(getStudentByRollNumber); // Add this route

export default saveCertificateRouter