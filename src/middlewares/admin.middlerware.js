// admin.middleware.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adminMiddleware = asyncHandler(async (req, res, next) => {
  // Assuming req.user contains user information
  if (!req.user || !req.user.admin) {
    throw new ApiError(403, "Forbidden: Admin access required");
  }
  next();
});

export default adminMiddleware;
