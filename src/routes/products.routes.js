import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlerware.js"; //for creating protected route
import { Product } from "../models/product.model.js";
// import {upload} from "../middlewares/multer.middleware.js"
import createProductController from "../controllers/admin.controller.js";

const productRouter = Router();

// Adjust your backend route to handle dynamic parameter
productRouter.route(`/product-over-view/:id`).get( async (req, res) => {
    try {
      // Retrieve the product based on the dynamic ID parameter
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Send the product details in the response
      res.json({ product });
      console.log(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});




export default productRouter;