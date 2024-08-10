import {ApiError} from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Importing the uploadOnCloudinary function
import { v2 as cloudinary } from "cloudinary";
const createProductController = async (req, res) => {
  try {
      const { product, price, fakeprice, selectedSizes, selectedColors, category, description, quantity } = req.body;

      // if (!product  || !fakeprice  || !category || !description || !quantity ||!selectedSizes ||!selectedColors) {
      //     throw new ApiError(400, "All fields are required");
      // }
      if (!price) {
        throw new ApiError(400, "price field is required");
      }
      
      if (!fakeprice) {
        throw new ApiError(400, "fakeprice field is required");
      }
      
      if (!selectedSizes || selectedSizes.length === 0) {
        throw new ApiError(400, "selectedSizes field is required and cannot be empty");
      }
      
      if (!selectedColors || selectedColors.length === 0) {
        throw new ApiError(400, "selectedColors field is required and cannot be empty");
      }
      
      if (!category) {
        throw new ApiError(400, "category field is required");
      }
      
      if (!description) {
        throw new ApiError(400, "description field is required");
      }
      
      if (!quantity) {
        throw new ApiError(400, "quantity field is required");
      }

      const productImages = req.files?.map(file => file.path);

if (!productImages || productImages.length === 0) {
  throw new ApiError(400, "Product images are required");
}




      const parsedSizes = JSON.parse(selectedSizes);
      const parsedColors = JSON.parse(selectedColors);
      const createdProduct = await Product.create({
          product,
          price,
          fakeprice,
          productImage: [],
          category,
          description,
          quantity,
          sizes: parsedSizes, // Assuming selectedSizes is an array of selected sizes
          colors: parsedColors,
      });

      if (createdProduct) {
        // If the product was successfully created, upload images to Cloudinary
        const uploadedImageUrls = await Promise.all(
          productImages.map(async (imageUrl) => {
            const cloudinaryUploadResponse = await cloudinary.uploader.upload(imageUrl, {
              folder: "product-images", // Specify folder in Cloudinary
            });
            return cloudinaryUploadResponse.secure_url;
          })
        );
  
        // Update the product with the uploaded image URLs
        createdProduct.productImage = uploadedImageUrls;
        await createdProduct.save();
      }
  
      res.status(201).json(createdProduct);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error: Product already exists
        res.status(409).json({ message: 'Product already exists' });
      } else {
        // Other errors
        console.error('Error saving Product:', error);
        res.status(500).json({ error: 'Internal Server Error while uploading' });
      }
    }
  };
  
  export default createProductController;