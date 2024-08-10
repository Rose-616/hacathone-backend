import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";

const orderController = async (req, res) => {
  try {
    const {customer, products, total } = req.body;
    if (!customer || !products || !total) {
      // If required fields are missing, return a 400 error
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Validate required fields
    
    // Create the new order
    const createdOrder = await Order.create({
      customer,
      products,
      total,
       // Assuming selectedColors is an array
    });

    // Save the order
    await createdOrder.save();

    // Respond with the created order
    res.status(201).json(createdOrder);
  } catch (error) {
    if (error instanceof ApiError) {
      // Custom error handling with specific status codes
      res.status(error.statusCode).json({ message: error.message });
    } else if (error.code === 11000) {
      // Duplicate key error
      res.status(409).json({ message: "Order already exists" });
    } else {
      // General error handling
      console.error("Error saving order:", error);
      res.status(500).json({ error: "Internal Server Error while placing order" });
    }
  }
};

export default orderController;
