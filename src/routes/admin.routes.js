import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlerware.js"; //for creating protected route
import { Product } from "../models/product.model.js";
import {uploadEcommerce} from "../middlewares/multer.middleware.js"
import createProductController from "../controllers/admin.controller.js";
import orderController from "../controllers/order.controller.js";
import { Order } from "../models/order.model.js";



const adminRouter = Router();

adminRouter.route("/create-product").post(
  // verifyJWT,
   // Verify JWT token
   uploadEcommerce.array("productImage", 4), // Use the upload middleware to handle image uploads
  createProductController // Controller function for creating a product
);




adminRouter.route("/create-productss").get( async (req, res) => {
    try {
      // Assuming you have a Blog model
      const products = await Product.find();

     
      
      // Send the list of blogs in the response
      res.json({ products });
      // console.log(products)
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  adminRouter.route("/manage-products").get(verifyJWT,async (req, res) => {
    try {
      const products = await Product.find(); // Check if this returns a list of products
      if (!products) {
        return res.status(404).json({ error: 'No products found' }); // Handle no data
      }
  
      res.json({ products }); // Make sure this returns an object with 'products' key
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  adminRouter.route("/edit-product/:productId").get(verifyJWT,async (req, res) => {
    const { productId } = req.params;
    try {
      // Attempt to find the product with the given ID
      const product = await Product.findById(productId);
  
      if (!product) {
        // If no product was found with the given ID, return a 404 error
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // If the product is found, return the product details
      res.json(product);
  
    } catch (error) {
      console.error('Error fetching product:', error);
      // If an internal server error occurs, respond with a 500 error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  adminRouter.route('/delete-product/:productId').delete(verifyJWT,async (req, res) => {
    const { productId } = req.params; // Get product ID from the route parameter
  
    try {
      // Attempt to delete the product with the given ID
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        // If no product was found with the given ID, return a 404 error
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // If the product was deleted successfully, respond with a success message
      res.json({ message: 'Product deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting product:', error);
      // If an internal server error occurs, respond with a 500 error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  adminRouter.put('/edit-product/:productId', verifyJWT,async (req, res) => {
    const { productId } = req.params; // Get product ID from the route parameter
    const updatedData = req.body; // Get updated data from the request body
  
    try {
      // Update the product with the given ID and new data
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true } // Return the updated document
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // If successful, respond with the updated product
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  adminRouter.delete('/delete-image',verifyJWT, async (req, res) => {
    const { productId, imageUrl } = req.body;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Remove the image URL from the product's `productImage` array
      product.productImage = product.productImage.filter((img) => img !== imageUrl);
  
      // Save the product with the updated image array
      await product.save();
  
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


export default adminRouter;