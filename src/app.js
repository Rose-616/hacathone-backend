import express from "express";

import cookieParser from "cookie-parser";
import userRouter from './routes/user.routes.js';
import blogRouter from "./routes/blog.routes.js";
import adminRouter from "./routes/admin.routes.js"
import orderRouter from "./routes/order.routes.js"
import productRouter from "./routes/products.routes.js";
import cors from 'cors';
 import saveCertificateRouter from "./routes/saveCertificate.routes.js";
const app = express();
app.use(cors({
  origin: ['*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the HTTP methods you want to allow
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/v1/users", userRouter);
app.use("/api/v1/save-certificate", saveCertificateRouter);

app.use("/api/Admin", adminRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/v1/blog", blogRouter);

export { app };
