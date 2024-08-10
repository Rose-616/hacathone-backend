import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
     
          },
    price: {
      type: String, // Change to Number for numeric values
      required: true,
    },
    fakeprice: {
      type: String, // Change to Number for numeric values
      required: true,
    },
    productImage: {
      type: [String], // Assuming the username is stored in req.user.username
    },
    category: {
      type: String, // Change to a more specific data type if needed
    },
    description: {
        type: String, // Change to a more specific data type if needed
      },
    quantity: {
      type: Number, // Change to Number for numeric values
    },
    sizes: {
      type: [String], // Array of available sizes
    },
    colors: {
      type: [String], // Array of available colors
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
