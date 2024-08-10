import orderController from "../controllers/order.controller.js";
import { Order } from "../models/order.model.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlerware.js"; //for creating protected route
import { Product } from "../models/product.model.js";

const orderRouter = Router();



orderRouter.route('/order-product').post(
    orderController // Allow any user to place an order
  );
  
  orderRouter.route("/total-order").get( verifyJWT,async (req, res) => {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
  
      const orders = await Order.find()
        .skip((page - 1) * limit) // Implement pagination
        .limit(limit); // Limit the number of results
  
      const totalOrders = await Order.countDocuments(); // Total number of orders for pagination info
  
      res.json({
        page,
        limit,
        totalOrders,
        orders, // Return the list of orders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error for orders' });
    }
  });

  orderRouter.put('/update/:orderId',verifyJWT, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    // Validate order ID
    const validStatuses = ['Pending', 'Process', 'Dispatched', 'Delivered', 'Cancelled'];
  
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
  
    res.status(200).json(updatedOrder);
  });
  


  orderRouter.route("/track-order").get(verifyJWT,async (req, res) => {
    try {
      console.log("Tracking order...");
  
      const { email } = req.query;
      console.log('Received email:', email);
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required to track orders.' });
      }
  
      // Find orders with the given email
      // Query for orders where customer.email matches the given email
const orders = await Order.find({ 'customer.email': email }).select('status customer createdAt');
 
      console.log("Fetched orders:", orders);
  
      if (orders.length === 0) {
        console.warn('No orders found for email:', email);
        return res.status(404).json({ message: 'No orders found for the given email.' });
      }
      const simplifiedOrders = orders.map(order => ({
        status: order.status,
        createdAt: order.createdAt,
        customer: {
          firstName: order.customer.firstName,
        },
      }));
      
      res.json({ orders: simplifiedOrders });
     
    } catch (error) {
      console.error('Error tracking order:', error);
      res.status(500).json({ error: 'Internal Server Error while tracking orders' });
    }
  });
  
  
  
  


  export default orderRouter;